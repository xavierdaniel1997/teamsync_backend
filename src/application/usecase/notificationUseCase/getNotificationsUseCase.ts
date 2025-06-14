import { INotification } from "../../../domain/entities/notification";
import { INotificationRepo } from "../../../domain/repositories/notificationRepo";

export class GetNotificationsUseCase{
    constructor(
        private notificationRepo : INotificationRepo,
    ){}

    async execute(userId: string, filter: 'all' | 'read' | 'unread' = 'all'):Promise<INotification[]>{
        if(!userId){
            throw new Error("userId is missing")
        }

        const notifications = await this.notificationRepo.getNotificationsByUser(userId, filter)
        if(!notifications){
            throw new Error('Failed to fetch the notifications from database')
        }
    
        return notifications;
    }
}