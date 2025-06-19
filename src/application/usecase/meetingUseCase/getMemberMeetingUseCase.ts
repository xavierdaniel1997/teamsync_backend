import { IMeeting } from "../../../domain/entities/meeting";
import { IMeetingRepo } from "../../../domain/repositories/meetingRepo";

export class GetMemberMeetingUseCase{
    constructor(
        private meetingRepo : IMeetingRepo,
    ){}

    async execute(userId: string, statuses: string[]):Promise<IMeeting[]>{
        if(!userId){
            throw new Error("User id is missing")
        }
        const meeting = await this.meetingRepo.myMeetings(userId, statuses)
        if(!meeting){
            throw new Error("No Meeting or Dose not have assess to the meetings")
        }
        return meeting;
    }
}