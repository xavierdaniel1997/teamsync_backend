import mongoose from "mongoose";
import { IChat } from "../../domain/entities/chat";
import { IChatRepo } from "../../domain/repositories/chatRepo";
import ChatModel from "../database/chatModel";
import { timeStamp } from "console";

export class ChatRepoImpl implements IChatRepo {

    async saveMessage(chat: IChat): Promise<IChat> {
        return await ChatModel.create(chat);
    }

    async getConversation(projectId: string, userId1: string, userId2: string): Promise<IChat[]> {
        try {
            const messages = await ChatModel.find({
                projectId,
                $or: [{ senderId: userId1, recipientId: userId2 }
                    , { senderId: userId2, recipientId: userId1 }]
            })
            return messages.map((msg) => ({
                // ...msg,
                _id: msg._id.toString(),
                projectId: msg.projectId.toString(),
                senderId: msg.senderId.toString(),
                recipientId: msg.recipientId.toString(),
                timestamp: msg.timestamp,
                read: msg.read,
                message: msg.message,
            }));
        } catch (error: any) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }

}