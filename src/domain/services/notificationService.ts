import { INotification } from "../entities/notification";

export interface NotificationService{
    notifyUser(notification: INotification): Promise<void>;
}