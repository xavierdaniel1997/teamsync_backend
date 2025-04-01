import { IInvitation, InvitationStatus } from "../../../domain/entities/invitation";
import { IInvitationRepo } from "../../../domain/repositories/invitationRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";
import { IUserRepo } from "../../../domain/repositories/userRepo";

interface AcceptInvitationDTO {
    token: string;
    userId?: string;
}

interface AcceptInvitationResponse {
    invitation: IInvitation;
    redirectUrl: string;
    requiresRegistration?: boolean;
    email?: string;
}

export class AcceptInvitationUseCase {
    constructor(
        private invitationRepo: IInvitationRepo,
        private projectRepo: IProjectRepo,
        private workSpaceRepo: IWorkSpaceRepo,
        private userRepo: IUserRepo
    ) {}

    async execute({ token, userId }: AcceptInvitationDTO): Promise<AcceptInvitationResponse> {
        const invitation = await this.invitationRepo.findByToken(token);
        if (!invitation || invitation.status !== InvitationStatus.PENDING || invitation.expiresAt < new Date()) {
            if (invitation && invitation.expiresAt < new Date()) {
                await this.invitationRepo.update(token, { status: InvitationStatus.EXPIRED });
            }
            throw new Error("Invalid or expired invitation");
        }

        let user = userId ? await this.userRepo.findById(userId) : await this.userRepo.findByEmail(invitation.email);
        if (!user) {
            const redirectUrl = `http://localhost:5173/register?email=${invitation.email}&token=${token}`;
            return { invitation, redirectUrl, requiresRegistration: true, email: invitation.email };
        }

        await this.workSpaceRepo.updateWorkspaceMembers(invitation.workspace.toString(), user._id!.toString());
        await this.projectRepo.addMember(invitation.project.toString(), user._id!.toString(), invitation.accessLevel);

        const updatedInvitation = await this.invitationRepo.update(token, { status: InvitationStatus.ACCEPTED });
        if (!updatedInvitation) throw new Error("Failed to update invitation");

        const redirectUrl = `http://localhost:5173/workspace/${invitation.workspace}/project/${invitation.project}`;
        return { invitation: updatedInvitation, redirectUrl };
    }
}