import { IChat } from "../../../domain/entities/chat";
import { IChatRepo } from "../../../domain/repositories/chatRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";

export class GetMessagesUseCase {
    constructor(
        private chatRepo: IChatRepo,
        private projectRepo: IProjectRepo
    ) { }

    async execute(projectId: string, recipientId: string, userId: string): Promise<IChat[]> {
        const project = await this.projectRepo.findUserAccess(projectId,  userId);
        if (!project) {
            throw new Error("Project not found or user does not have access.....");
        }
        // return await this.chatRepo.getMessagesByProject(projectId);
        return await this.chatRepo.getMessagesBetweenUsers(projectId, userId, recipientId);
    }
}