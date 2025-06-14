
export enum NotificationStatus {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}


export interface INotification {
    _id?: string;
    recipientId: string;
    notificationStatus: NotificationStatus;
    title: string;
    message: string;
    description?: string;
    from?: string;
    subtitle?: string;
    taskId?: string;
    projectId?: string;
    createdAt: Date;
    eventType?: string; 
    isRead: boolean;
}