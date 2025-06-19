import { IMeeting } from "../entities/meeting";

export interface IMeetingRepo{
    create(meeting: IMeeting): Promise<IMeeting>
    myMeetings(memberId: string, statuses: string[]): Promise<IMeeting[]>
}