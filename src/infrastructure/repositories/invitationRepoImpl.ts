import { IInvitation } from "../../domain/entities/invitation";
import { IInvitationRepo } from "../../domain/repositories/invitationRepo";
import InvitationModel from "../database/invitationModel";

export class InvitationRepoImpl implements IInvitationRepo {
    async create(invitation: Partial<IInvitation>): Promise<IInvitation> {
        return await InvitationModel.create(invitation)
    }

    async findByToken(token: string): Promise<IInvitation | null> {
        return await InvitationModel.findOne({ token })
            .populate("inviter")
            .populate("project")
            .populate("workspace");
    }

    async update(token: string, updateData: Partial<IInvitation>): Promise<IInvitation | null> {
        return await InvitationModel.findOneAndUpdate({ token }, updateData, { new: true })
            .populate("inviter")
            .populate("project")
            .populate("workspace");
    }
}