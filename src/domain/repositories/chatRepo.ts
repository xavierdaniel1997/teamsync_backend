import mongoose from "mongoose";
import { IChat } from "../entities/chat";

export interface IChatRepo {
    saveMessage(chat: IChat): Promise<IChat>
    getMessagesByProject(projectId: string): Promise<IChat[]>;
    getMessagesBetweenUsers(projectId: string, userId: string, recipientId: string): Promise<IChat[]>
}