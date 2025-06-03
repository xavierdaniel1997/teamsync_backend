import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { ChatRepoImpl } from "../../../../infrastructure/repositories/chatRepoImpl";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { GetMessageUseCase } from "../../../../application/usecase/chatRoom/getMessageUseCase";
import { GetMessagesDto } from "../../../../domain/dtos/chatDTO";

const chatRepo = new ChatRepoImpl();
const projectRepo = new ProjectRepoImpl();
const getMessageUseCase = new GetMessageUseCase(chatRepo, projectRepo);

const getMessageController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId, recipientId } = req.query;
        const currentUserId = (req as any).user?.userId;
        const messages = await getMessageUseCase.execute({ projectId: projectId as string, recipientId: recipientId as string }, currentUserId)
        sendResponse(res, 200, messages, "Successfully fetch the messages")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the messages")   
    }
}                         


export {getMessageController}   