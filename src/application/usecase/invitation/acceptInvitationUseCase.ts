import { IInvitation, InvitationStatus } from "../../../domain/entities/invitation";
import { IInvitationRepo } from "../../../domain/repositories/invitationRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class AcceptInvitationUseCase{
    constructor(
        private invitationRepo : IInvitationRepo,
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
        private userRepo: IUserRepository,
    ){}

    async execute (token: string, userId: string) : Promise<{ invitation: IInvitation; redirectUrl: string; requiresRegistration: boolean; email: string } | void>{

        const invitation = await this.invitationRepo.findByToken(token)

        if (!invitation || invitation.status !== InvitationStatus.PENDING || invitation.expiresAt < new Date()) {
            if (invitation && invitation.expiresAt < new Date()) {
                await this.invitationRepo.update(token, { status: InvitationStatus.EXPIRED });
            }
            throw new Error("Invalid or expired invitation");
        }

        let user = userId ? await this.userRepo.findUserById(userId) : await this.userRepo.findByEmail(invitation.email);
        if (!user) {
            const redirectUrl = `http://localhost:5173/register?email=${invitation.email}&token=${token}`;
            return { invitation, redirectUrl, requiresRegistration: true, email: invitation.email };
        }

        await this.workspaceRepo.updateWorkspaceMembers(invitation.workspace.toString(), user._id!.toString());
        await this.projectRepo.addMember(invitation.project.toString(), user._id!.toString(), invitation.accessLevel);

        const updatedInvitation = await this.invitationRepo.update(token, { status: InvitationStatus.ACCEPTED });
        if (!updatedInvitation) throw new Error("Failed to update invitation");

        const redirectUrl = `http://localhost:5173/workspace/${invitation.workspace}/project/${invitation.project}`;
        return { invitation: updatedInvitation, redirectUrl, requiresRegistration: false, email: invitation.email };
    }
}