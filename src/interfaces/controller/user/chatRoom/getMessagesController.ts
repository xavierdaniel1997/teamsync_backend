import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { ChatRepoImpl } from "../../../../infrastructure/repositories/chatRepoImpl";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { GetMessagesUseCase } from "../../../../application/usecase/chatRoom/getMessagesUseCase";

const chatRepo = new ChatRepoImpl();
const projectRepo = new ProjectRepoImpl();
const getMessagesUseCase = new GetMessagesUseCase(chatRepo, projectRepo);

export const getMessagesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { projectId } = req.params;
        const { recipientId } = req.query; 

        if (!userId) {
            sendResponse(res, 401, null, "User not authenticated");
            return;
        }

        if (!recipientId || typeof recipientId !== 'string') {
            sendResponse(res, 400, null, "Recipient ID is required");
            return;
        }

        const messages = await getMessagesUseCase.execute(projectId, userId, recipientId);
        sendResponse(res, 200, messages, "Successfully fetched messages");
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch messages");
    }
};