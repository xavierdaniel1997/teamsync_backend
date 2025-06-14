import mongoose, { Schema, Document } from 'mongoose';
import { INotification, NotificationStatus } from '../../domain/entities/notification';

const notificationSchema = new Schema<INotification>({
    recipientId: { type: String, required: true, index: true },
    notificationStatus: {
        type: String,
        enum: Object.values(NotificationStatus),
        default: NotificationStatus.INFO
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    description: {type: String},
    from: {type: String},
    subtitle: { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    createdAt: { type: Date, default: Date.now },
    eventType: {type: String},
    isRead: { type: Boolean, default: false },
})


const NotificationModal = mongoose.model<INotification>('Notification', notificationSchema);
export default NotificationModal;