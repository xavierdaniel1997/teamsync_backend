import { INotification, NotificationStatus } from "../../../domain/entities/notification";
import { INotificationRepo } from "../../../domain/repositories/notificationRepo";

export class CreateNotificationUseCase {
    constructor(
        private notificationRepo: INotificationRepo,
        
    ) { }

    async execute(
        recipientId: string,
        title: string,
        message: string,
        description?: string,
        from?: string,
        subtitle?: string,
        taskId?: string,
        projectId?: string,
        eventType?: string,
        status: NotificationStatus = NotificationStatus.INFO
    ): Promise<INotification> {
        const newNotification: Partial<INotification> = {
            recipientId,
            title,
            message,
            description,
            from,
            subtitle,
            taskId,
            projectId,
            eventType,
            notificationStatus: status,
            createdAt: new Date(),
            isRead: false,
        };
        const notification = await this.notificationRepo.createNotification(newNotification)
        // console.log("notificatin saved from the createnotificationusecase", notification)
        return notification;
    }
}