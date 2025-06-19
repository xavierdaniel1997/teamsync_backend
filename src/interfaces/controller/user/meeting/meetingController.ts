import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { Server as SocketIOServer } from "socket.io";
import { MeetingRepoImp } from "../../../../infrastructure/repositories/meetingRepoImp";
import { ScheduleMeetingUseCase } from "../../../../application/usecase/meetingUseCase/scheduleMeetingUseCase";
import { GetMemberMeetingUseCase } from "../../../../application/usecase/meetingUseCase/getMemberMeetingUseCase";
import { INotificationRepoImpl } from "../../../../infrastructure/repositories/notificationRepoImpl";
import { NotificationSocketService } from "../../../../infrastructure/services/notificationSocketService";
import { CreateNotificationUseCase } from "../../../../application/usecase/notificationUseCase/createNotificationUseCase";

const meetingRepo = new MeetingRepoImp()
const notificationRepo = new INotificationRepoImpl(); 
const io = new SocketIOServer(); 
const notificationService = new NotificationSocketService(io);
const notificationUseCase = new CreateNotificationUseCase(notificationRepo);
const scheduleMeetingUseCase = new ScheduleMeetingUseCase(meetingRepo, notificationUseCase, notificationService)
const getMemberMeetingUseCase = new GetMemberMeetingUseCase(meetingRepo)

const createMeetingController = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        const {meetingTitle, meetingTime, meetingDate, duration, description, members, meetingId} = req.body;
        const meeting = await scheduleMeetingUseCase.execute({meetingTitle, meetingTime, meetingDate, duration, description, members, meetingId, userId})
        sendResponse(res, 200, meeting, "Successfully create the meeting")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to create the meeting")
    }
}

const getMeetingByMembers = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        const status = req.query.statuses as string | undefined; // Expect single string
        console.log("from getMeetingByMembers", status);

        const statuses = status ? [status] : ['latest'];
        const meeting = await getMemberMeetingUseCase.execute(userId, statuses)
        sendResponse(res, 200, meeting, "Successfully fetch the meetings")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch the meeting")
    }
}

export {createMeetingController, getMeetingByMembers}