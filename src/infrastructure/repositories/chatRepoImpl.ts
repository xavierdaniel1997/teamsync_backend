import mongoose from "mongoose";
import { IChat } from "../../domain/entities/chat";
import { IChatRepo } from "../../domain/repositories/chatRepo";
import ChatModel from "../database/chatModel";

export class ChatRepoImpl implements IChatRepo {

    async saveMessage(chat: IChat): Promise<IChat> {
        return await ChatModel.create(chat);
    }

    async getMessagesByProject(projectId: string): Promise<IChat[]> {
        return await ChatModel.find({ projectId: new mongoose.Types.ObjectId(projectId) })
            .populate("sender", "fullName avatar")
            .sort({ createdAt: 1 });
    }

    async getMessagesBetweenUsers(projectId: string, userId: string, recipientId: string): Promise<IChat[]> {
        return await ChatModel.find({
            projectId,
            $or: [
                { senderId: userId, recipientId },
                { senderId: recipientId, recipientId: userId },
            ],
        }).sort({ timestamp: 1 });
    }
}