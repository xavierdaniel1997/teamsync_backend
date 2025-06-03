import mongoose from "mongoose";
import { IChat } from "../entities/chat";

export interface IChatRepo {
    saveMessage(chat: IChat): Promise<IChat>
    getConversation(projectId: string, userId1: string, userId2: string):Promise<IChat[]>
}