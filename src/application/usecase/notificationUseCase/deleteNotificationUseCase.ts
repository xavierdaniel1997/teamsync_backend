import { INotificationRepo } from "../../../domain/repositories/notificationRepo";

export class DeleteNotificationUseCase {
    constructor(
        private notificationRepo: INotificationRepo
    ) { }

    async execute(notificationId: string, userId: string): Promise<void> {
        const notification = await this.notificationRepo.getNotificationById(notificationId)
        if (!notification) {
            throw new Error("notification not found")
        }
        if (notification.recipientId === userId) {
            await this.notificationRepo.deleteNotification(notificationId);
        }
    }
}