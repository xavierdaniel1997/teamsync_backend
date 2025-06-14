import { Server as SocketIOServer } from "socket.io";
import { INotification } from "../../domain/entities/notification";
import { NotificationService } from "../../domain/services/notificationService";
import { INotificationRepo } from "../../domain/repositories/notificationRepo";

export class NotificationSocketService implements NotificationService {
    constructor(
        public io: SocketIOServer,
    ) {}

    async notifyUser(notification: INotification): Promise<void> {
        this.io.to(notification.recipientId).emit("notification", notification);
    }
}