import { Types } from "mongoose";
import { MeetingDTO } from "../../../domain/dtos/meetingDTO";
import { IMeeting } from "../../../domain/entities/meeting";
import { IMeetingRepo } from "../../../domain/repositories/meetingRepo";
import { v4 as uuidv4 } from "uuid";
import { CreateNotificationUseCase } from "../notificationUseCase/createNotificationUseCase";
import { NotificationService } from "../../../domain/services/notificationService";
import { NotificationStatus } from "../../../domain/entities/notification";

export class ScheduleMeetingUseCase {
    constructor(
        private meetingRepo: IMeetingRepo,
        private notificationUseCase: CreateNotificationUseCase,
        private notificationService: NotificationService,
    ) { }

    async execute(meetingDTO: MeetingDTO): Promise<IMeeting> {
        const { meetingTitle, meetingTime, meetingDate, duration, description, members, meetingId, userId } = meetingDTO;

        const scheduledDate = new Date(`${meetingDate}T${meetingTime}:00`);

        const participants = members.map((member) => ({
            userId: new Types.ObjectId(member.userId),
            email: member.email
        }))

        const roomId = `meeting_${uuidv4()}`

        const newMeeting: IMeeting = {
            meetingId,
            meetingTitle,
            meetingTime,
            meetingDate,
            duration,
            description,
            scheduledDate,
            participants,
            creatorId: new Types.ObjectId(userId),
            createdAt: new Date(),
            roomId,
            status: "scheduled",
        }

        const meeting = await this.meetingRepo.create(newMeeting)
        console.log("meeting", meeting)

        const notificationPromises = meeting.participants.map(async (member) => {
            const memberId = member.userId._id.toString();
            // const hostedBy = meeting.creatorId.fullName
            try {
                const notification = await this.notificationUseCase.execute(
                    memberId,
                    "Meeting Created",
                    `New meeting has been created by ${meeting.creatorId} has been started at "${meeting.scheduledDate}" and dont forget to attend the meeting check you scheduled meetings.`,
                    "Sprint activity update",
                    "Sprint Notification",
                    undefined,
                    undefined,
                    undefined,
                    "MEETING_CREATED",
                    NotificationStatus.WARNING
                );
                await this.notificationService.notifyUser(notification);
            } catch (error: any) {
                console.error(`Failed to send notification to member ${memberId}:`, error.message, error.stack);
            }
        });
        await Promise.all(notificationPromises);

        return meeting;

    }
}
