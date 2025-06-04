import mongoose from "mongoose";
import { GroupedMessage, IChat } from "../../domain/entities/chat";
import { IChatRepo } from "../../domain/repositories/chatRepo";
import ChatModel from "../database/chatModel";
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { timeStamp } from "console";

export class ChatRepoImpl implements IChatRepo {

    async saveMessage(chat: IChat): Promise<IChat> {
        return await ChatModel.create(chat);
    }

    async getConversation(projectId: string, userId1: string, userId2: string): Promise<GroupedMessage[]> {
        try {
            const messages = await ChatModel.find({
                projectId,
                $or: [{ senderId: userId1, recipientId: userId2 }
                    , { senderId: userId2, recipientId: userId1 }]
            })

            const grouped: { [key: string]: IChat[] } = {};

            messages.forEach((msg) => {
                const date = new Date(msg.timestamp);
                const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
                if (!grouped[dateKey]) {
                    grouped[dateKey] = []
                }
                grouped[dateKey].push({
                    _id: msg._id.toString(),
                    projectId: msg.projectId.toString(),
                    senderId: msg.senderId.toString(),
                    recipientId: msg.recipientId.toString(),
                    timestamp: msg.timestamp,
                    read: msg.read,
                    message: msg.message,   
                })
            })

            const groupedMessags : GroupedMessage[] = Object.keys(grouped)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map((dateKey) => {
                const date = new Date(dateKey);
                let label = format(date, 'MMMM d, yyyy');
                if(isToday(date)){
                    label = 'Today';
                }else if(isYesterday(date)){
                    label = 'Yesterday'
                }
                return {
                    date: dateKey,
                    label,
                    messages: grouped[dateKey],
                }
            })
            return groupedMessags;
        } catch (error: any) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }

}