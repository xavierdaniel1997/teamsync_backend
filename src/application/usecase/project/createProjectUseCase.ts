import { Types } from "mongoose";
import { IProject, ProjectAccessLevel } from "../../../domain/entities/project";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISubscriptionRepo } from "../../../domain/repositories/subscriptionRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { v4 as uuidv4 } from "uuid";
import { InvitationStatus } from "../../../domain/entities/invitation";
import { IInvitationRepo } from "../../../domain/repositories/invitationRepo";
import { EmailType, sendEmail } from "../../../interfaces/utils/emailService";


interface CreateProjectDTO {
    name: string;
    projectkey: string;
    title?: string;
    description?: string;
    workspaceId: string;
    userId: string;
    emails?: string[];
    accessLevel?: ProjectAccessLevel;
}

export class CreateProjectUseCase {
    constructor(
        private projectRepo: IProjectRepo,
        private workSpaceRepo: IWorkSpaceRepo,
        private subscriptionRepo: ISubscriptionRepo,
        private planRepo: IPlanRepository,
        private invitationRepo: IInvitationRepo
    ) { }

    async execute(projectData: CreateProjectDTO): Promise<IProject> {
        const { name, projectkey, title, description, workspaceId, userId, emails = [], accessLevel = ProjectAccessLevel.READ} = projectData;

        const workspace = await this.workSpaceRepo.findWorkSpaceByOwner(userId)
        // console.log("workspace form the project usecase", workspace)
        if (!workspace || workspace._id?.toString() !== workspaceId) {
            throw new Error("Workspace not found or user lacks permission");
        }
   
        const subscription = await this.subscriptionRepo.findByWorkspace(workspaceId);
        // console.log("subscription form the projct usecase", subscription)
        if (!subscription || !subscription.plan) {
            throw new Error("No active subscription found");
        }

        const planId = subscription.plan as any;  
        const plan = await this.planRepo.findById(planId)
        if (!plan) {
            throw new Error("Plan not found");
        }
        
        const currentProjectCount = workspace.projects.length;
        if (currentProjectCount >= plan.projectLimit.valueOf()) {                
            throw new Error(`Project limit of ${plan.projectLimit} reached for this plan`);
        }
     
        const projectDetails: Partial<IProject> = {
            name,
            projectkey, 
            title,             
            description,
            workspace: new Types.ObjectId(workspaceId),
            owner: new Types.ObjectId(userId),
            members: [{user: new Types.ObjectId(userId), accessLevel: ProjectAccessLevel.OWNER}],
            invitations: [],
            createdAt: new Date()
        }


        const project = await this.projectRepo.create(projectDetails)
 

        await this.workSpaceRepo.updateWorkspaceProjects(workspaceId, project._id!.toString());
        const invitationIds: Types.ObjectId[] = [];
        if(emails.length > 0){
            for(const email of emails){
                const token = uuidv4();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);

                const invitation = {
                    email,
                    inviter: new Types.ObjectId(userId),
                    project: project._id!,
                    workspace: new Types.ObjectId(workspaceId),
                    accessLevel,
                    status: InvitationStatus.PENDING,
                    token,
                    expiresAt,
                    createdAt: new Date(),
                }
                const createdInvitation = await this.invitationRepo.create(invitation)
                console.log("invited result", createdInvitation);
                const invitationId = createdInvitation._id instanceof Types.ObjectId
                    ? createdInvitation._id
                    : new Types.ObjectId(createdInvitation._id);
                invitationIds.push(invitationId);
                console.log("invitationId pushed:", invitationId.toString()); 

                const inviteLink = `${process.env.CLIENT_ORIGIN}/invite/accept?token=${token}`;
                console.log("checking the invitedLink in create project.......................", inviteLink)
                const mailsend = await sendEmail(email, EmailType.INVITE, {
                    sender: "The Admin",  
                    teamName: name,                     
                    inviteLink,                          
                });
            }
            const updateResult = await this.projectRepo.update(project._id!.toString(), {
                $push: { invitations: { $each: invitationIds } },
            });
            if (!updateResult || !updateResult.invitations || updateResult.invitations.length !== invitationIds.length) {
                throw new Error(`Failed to add invitation IDs to project. Expected ${invitationIds.length} invitations, got ${updateResult?.invitations?.length || 0}`);
            }
        }

        const updatedProject = await this.projectRepo.findById(project._id!.toString());
        if (!updatedProject) {
            throw new Error("Failed to fetch updated project");
        }

        return updatedProject;
    }
}