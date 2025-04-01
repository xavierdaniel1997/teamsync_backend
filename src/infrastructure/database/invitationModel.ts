import mongoose, { Schema } from "mongoose";
import { IInvitation, InvitationStatus } from "../../domain/entities/invitation";
import { ProjectAccessLevel } from "../../domain/entities/project";

const invitationSchema = new Schema<IInvitation>({
    email: { type: String, required: true },
    inviter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
    accessLevel: {
        type: String,
        enum: Object.values(ProjectAccessLevel),
        default: ProjectAccessLevel.READ,
    },
    status: {
        type: String,
        enum: Object.values(InvitationStatus),
        default: InvitationStatus.PENDING,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
})

const InvitationModel = mongoose.model<IInvitation>('Invitation', invitationSchema)
export default InvitationModel;