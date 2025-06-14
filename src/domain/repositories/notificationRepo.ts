import { INotification } from "../entities/notification";

export interface INotificationRepo {
    createNotification(notification: Partial<INotification>): Promise<INotification>,
    getNotificationsByUser(userId: string, filter?: 'all' | 'read' | 'unread'): Promise<INotification[]>
    getNotificationById(_id: string): Promise<INotification | null>,
    updateNotifcation(_id: string): Promise<INotification | null>
    deleteNotification(_id: string): Promise<void>
}