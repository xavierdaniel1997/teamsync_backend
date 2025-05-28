import mongoose from 'mongoose';
import { IChat } from '../../../domain/entities/chat';
import { IChatRepo } from '../../../domain/repositories/chatRepo';
import { IProjectRepo } from '../../../domain/repositories/projectRepo';

export class SendMessageUseCase {
  constructor(
    private chatRepo: IChatRepo,
    private projectRepo: IProjectRepo
  ) {}

  async execute(projectId: string, recipientId: string, senderId: string, message: string): Promise<IChat> {
    const project = await this.projectRepo.findUserAccess(projectId, senderId);
    if (!project) {
      throw new Error('Project not found or user does not have access.');
    }

    const chat: IChat = {
      projectId: new mongoose.Types.ObjectId(projectId),
      senderId: new mongoose.Types.ObjectId(senderId),
      recipientId: new mongoose.Types.ObjectId(recipientId),
      message,
      timestamp: new Date(),
    };

    return await this.chatRepo.saveMessage(chat);
  }
}