import { IMeeting } from "../../domain/entities/meeting";
import { IMeetingRepo } from "../../domain/repositories/meetingRepo";
import MeetingModel from "../database/meetingModel";

export class MeetingRepoImp implements IMeetingRepo {
    async create(meeting: IMeeting): Promise<IMeeting> {
        return await MeetingModel.create(meeting)
    }

    async myMeetings(memberId: string, statuses: string[]): Promise<IMeeting[]> {
        const query: any = {
            $or: [
                { creatorId: memberId },
                { "participants.userId": memberId }
            ]
        }
        console.log("form the meetingimp", statuses)
        const statusFilter = statuses.includes('latest') 
            ? ['scheduled', 'ongoing']
            : statuses.includes('old') 
            ? ['ended']
            : statuses;

        if (statusFilter.length) {
            query.status = { $in: statusFilter };
        }    
        console.log("queryyyyyyyyyyyyyyyyyyyyyy", query)
        const meeting = await MeetingModel.find(query).populate({ path: 'creatorId', select: 'fullName secondName email avatar' })
            .populate({ path: 'participants.userId', select: '-password' })
        console.log("meeting for imp", meeting)
        return meeting;
    }
}