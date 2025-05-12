import { Types } from "mongoose";
import { IProject, ProjectAccessLevel } from "../../../domain/entities/project";
import { IInvitationRepo } from "../../../domain/repositories/invitationRepo";
import { IPlanRepository } from "../../../domain/repositories/planRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ISubscriptionRepo } from "../../../domain/repositories/subscriptionRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";
import { v4 as uuidv4 } from "uuid";
import { InvitationStatus } from "../../../domain/entities/invitation";
import { EmailType, sendEmail } from "../../../interfaces/utils/emailService";

export class InviteTeamMemberUseCase {
    constructor(
        private projectRepo: IProjectRepo,
        private workSpaceRepo: IWorkSpaceRepo,
        private subscriptionRepo: ISubscriptionRepo,
        private planRepo: IPlanRepository,
        private invitationRepo: IInvitationRepo
    ) { }

    async execute (userId: string, projectId: string, workspaceId: string, emails: string[]):Promise<IProject> {

        if (!userId || !projectId || !workspaceId || !emails || emails.length === 0) {
            throw new Error("Invalid input: userId, projectId, workspaceId, and non-empty emails are required");
        }

        const workspace = await this.workSpaceRepo.findById(workspaceId);
        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const project = await this.projectRepo.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        // console.log("project details form the invite team usecase", project)
        const member = project.members.find((m) => m.user._id.toString() === userId);
        if (!member || ![ProjectAccessLevel.OWNER, ProjectAccessLevel.WRITE].includes(member.accessLevel)) {
            throw new Error("User lacks permission to invite members");
        }

        const subscription = await this.subscriptionRepo.findByWorkspace(workspaceId);
        if (!subscription || !subscription.plan) {
            throw new Error("No active subscription found");
        }

        const planId = subscription.plan as any;
        const plan = await this.planRepo.findById(planId);
        if (!plan) {
            throw new Error("Plan not found");
        }


        const currentMemberCount = project.members.length + (project.invitations?.length ?? 0);
        if (plan.memberLimit && currentMemberCount + emails.length > Number(plan.memberLimit)) {
            throw new Error(`Member limit of ${plan.memberLimit} reached for this plan`);
        }

           const invitationIds: Types.ObjectId[] = [];
           const defaultAccessLevel = ProjectAccessLevel.READ;
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
                    accessLevel: defaultAccessLevel,
                    status: InvitationStatus.PENDING,
                    token,
                    expiresAt,
                    createdAt: new Date(),
                }
                const createdInvitation = await this.invitationRepo.create(invitation)
                // console.log("invited result", createdInvitation);
                const invitationId = createdInvitation._id instanceof Types.ObjectId
                    ? createdInvitation._id
                    : new Types.ObjectId(createdInvitation._id);
                invitationIds.push(invitationId);
                console.log("invitationId pushed:", invitationId.toString()); 

                const inviteLink = `http://localhost:5173/invite/accept?token=${token}`;
                const mailsend = await sendEmail(email, EmailType.INVITE, {
                    sender: "The Admin",  
                    teamName: project?.name,                     
                    inviteLink,                          
                });
                console.log("mail send", mailsend)
            }
            const updateResult = await this.projectRepo.update(project._id!.toString(), {
                $push: { invitations: { $each: invitationIds } },
            });
            console.log("updatedResult form the invited team use case", updateResult)
            if (!updateResult || !updateResult.invitations) {
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