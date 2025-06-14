import { INotification } from "../../domain/entities/notification";
import { INotificationRepo } from "../../domain/repositories/notificationRepo";
import NotificationModal from "../database/notificationModal";

export class INotificationRepoImpl implements INotificationRepo {

    async createNotification(notification: Partial<INotification>): Promise<INotification> {
        const newNotification = await NotificationModal.create(notification);
        return newNotification;
    }

    async getNotificationsByUser(userId: string, filter: 'all' | 'read' | 'unread' = 'all'): Promise<INotification[]> {
        const query: { recipientId: string; isRead?: boolean } = { recipientId: userId };
        if (filter === 'read') {
            query.isRead = true;
        } else if (filter === 'unread') {
            query.isRead = false;
        }
        // const notification = await NotificationModal.find({ recipientId: userId }).sort({ createdAt: -1 })
        const notifications = await NotificationModal.find(query).sort({ createdAt: -1 });
        return notifications;
    }

    async getNotificationById(_id: string): Promise<INotification | null> {
        return await NotificationModal.findOne({ _id })
    }

    async updateNotifcation(_id: string): Promise<INotification | null> {
        const notification = await NotificationModal.findByIdAndUpdate(
            _id,
            { $set: { isRead: true } },
            { new: true }
        )
        return notification;
    }

    async deleteNotification(_id: string): Promise<void> {
        await NotificationModal.findByIdAndDelete(_id)
    }
}