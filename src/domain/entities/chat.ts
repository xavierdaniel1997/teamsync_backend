import mongoose from 'mongoose';

export interface IChat {
  _id?: string;
  projectId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  message: string;
  timestamp?: Date;
}