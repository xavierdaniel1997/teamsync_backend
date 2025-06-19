import { Types } from "mongoose";

export interface IMeeting {
    meetingId: string;
    meetingTitle: string;
    meetingTime?: string;
    meetingDate?: string;
    participants: { userId: Types.ObjectId; email: string }[];
    creatorId: Types.ObjectId;
    scheduledDate?: Date;
    duration?: string;
    description?: string;
    roomId: string;
    createdAt: Date;
    status?: 'scheduled' | 'ongoing' | 'ended';
}




