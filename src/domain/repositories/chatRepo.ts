import mongoose from "mongoose";
import { GroupedMessage, IChat } from "../entities/chat";

export interface IChatRepo {
    saveMessage(chat: IChat): Promise<IChat>
    getConversation(projectId: string, userId1: string, userId2: string):Promise<GroupedMessage[]>
    findMessage(messageId: string): Promise<IChat | null>
    markMessagesAsRead(messageId: string): Promise<IChat | null>
    getUnreadMessageCount(projectId: string, senderId: string): Promise<{senderId: string; count: number }[]>;
}