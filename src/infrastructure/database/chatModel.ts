import mongoose, { Schema, Document } from 'mongoose';
import { IChat } from '../../domain/entities/chat';

const chatSchema = new Schema<IChat & Document>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});


const ChatModel = mongoose.model<IChat>('Chat', chatSchema);
export default ChatModel;