import mongoose, { Schema } from "mongoose";
import { IMeeting } from "../../domain/entities/meeting";

const meetingSchema = new Schema<IMeeting>({
    meetingId: { type: String, required: true, unique: true },
    meetingTitle: { type: String, required: true },
    participants: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            email: { type: String, required: true },
        },
    ],
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledDate: { type: Date },
    duration: { type: String },
    description: { type: String },
    roomId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'ended'],
        default: 'scheduled',
    },
})

const MeetingModel = mongoose.model<IMeeting>('meeting', meetingSchema)
export default MeetingModel;
