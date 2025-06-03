import mongoose from 'mongoose';

export interface IChat {
  _id?: string;
  projectId: mongoose.Types.ObjectId | string;
  senderId: mongoose.Types.ObjectId | string;
  recipientId: mongoose.Types.ObjectId | string;
  message: string;
  read: boolean;
  timestamp?: Date;
}