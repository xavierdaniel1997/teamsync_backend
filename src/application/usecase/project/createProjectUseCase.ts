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
        const { name, projectkey, description, workspaceId, userId, emails = [], accessLevel = ProjectAccessLevel.READ} = projectData;

        const workspace = await this.workSpaceRepo.findWorkSpaceByOwner(userId)
        console.log("workspace form the project usecase", workspace)
        if (!workspace || workspace._id?.toString() !== workspaceId) {
            throw new Error("Workspace not found or user lacks permission");
        }

        const subscription = await this.subscriptionRepo.findByWorkspace(workspaceId);
        console.log("subscription form the projct usecase", subscription)
        if (!subscription || !subscription.plan) {
            throw new Error("No active subscription found");
        }

        const planId = subscription.plan as any;  

        const plan = await this.planRepo.findById(planId)
        console.log("plan form the project plannnnnnnnnnnnn", plan)
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
            description,
            workspace: new Types.ObjectId(workspaceId),
            owner: new Types.ObjectId(userId),
            members: [{user: new Types.ObjectId(userId), accessLevel: ProjectAccessLevel.OWNER}],
            createdAt: new Date()
        }

        // console.log("project created befor db", projectDetails)
        const project = await this.projectRepo.create(projectDetails)
        // console.log("project create and saved in db", project)

        await this.workSpaceRepo.updateWorkspaceProjects(workspaceId, project._id!.toString());

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
                console.log("created invitation", invitation)
                await this.invitationRepo.create(invitation)

                const inviteLink = `http://localhost:5173/invite/accept?token=${token}`;
                const sendmail = await sendEmail(email, EmailType.INVITE, {
                    sender: workspace.owner.toString(),  
                    teamName: name,                     
                    inviteLink,                          
                });
                console.log("mail send sendmail")
            }
        }

        return project;
    }
}