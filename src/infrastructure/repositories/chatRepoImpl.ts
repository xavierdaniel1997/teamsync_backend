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

            const groupedMessags: GroupedMessage[] = Object.keys(grouped)
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                .map((dateKey) => {
                    const date = new Date(dateKey);
                    let label = format(date, 'MMMM d, yyyy');
                    if (isToday(date)) {
                        label = 'Today';
                    } else if (isYesterday(date)) {
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

    async findMessage(messageId: string): Promise<IChat | null> {
        return await ChatModel.findById(messageId)
    }

    async markMessagesAsRead(messageId: string): Promise<IChat | null> {
        // console.log("from the markmessageas read chatimp", messageId)
        // const message = await ChatModel.findByIdAndUpdate(new mongoose.Types.ObjectId(messageId), { read: true });
        const message = await ChatModel.findByIdAndUpdate(
                new mongoose.Types.ObjectId(messageId),
                { $set: { read: true } },
                { new: true } 
            ).lean();
            console.log("Updated message in ChatRepoImpl:", message);
        return message;
    }


    async getUnreadMessageCount(projectId: string, recipientId: string): Promise<{ senderId: string; count: number }[]> {
        try {
            const unreadCounts = await ChatModel.aggregate([
                {
                    $match: {
                        projectId: new mongoose.Types.ObjectId(projectId),
                        recipientId: new mongoose.Types.ObjectId(recipientId),
                        read: false,  
                    }
                },
                {
                    $group: {
                        _id: '$senderId',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        senderId: '$_id',
                        count: 1,
                        _id: 0
                    }
                }
            ])
            return unreadCounts;
        } catch (error: any) {
            throw new Error(`Failed to fetch unread message count: ${(error as Error).message}`);
        }
    }

}