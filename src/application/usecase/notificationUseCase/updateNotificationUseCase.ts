import { INotification } from "../../../domain/entities/notification";
import { INotificationRepo } from "../../../domain/repositories/notificationRepo";

export class UpdateNotificationUseCase {
    constructor(
        private notificationRepo: INotificationRepo,
    ) { }

    async execute(notificationId: string, userId: string): Promise<INotification> {

        const notification = await this.notificationRepo.getNotificationById(notificationId)
        if (!notification) {
            throw new Error("notification not found")
        }
        let readNotification;
        if (notification.recipientId === userId) {
            readNotification = await this.notificationRepo.updateNotifcation(notificationId);

        }
        if (!readNotification) {
            throw new Error("Failed to update read notification")
        }
        return readNotification;
    }
}