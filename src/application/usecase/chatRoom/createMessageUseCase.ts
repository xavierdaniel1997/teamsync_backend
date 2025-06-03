import { CreateMessageDto } from "../../../domain/dtos/chatDTO";
import { IChat } from "../../../domain/entities/chat";
import { IChatRepo } from "../../../domain/repositories/chatRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";

export class CreateMessageUseCase {
    constructor(
        private chatRepository: IChatRepo,
        private projectRepository: IProjectRepo
    ) { }


    async execute(dto: CreateMessageDto): Promise<IChat> {
        const { projectId, senderId, recipientId, message } = dto;

        if (!projectId || !senderId || !recipientId || !message) {
            throw new Error("Missing required fields");
        }

        const chat: IChat = {
            projectId,
            senderId,
            recipientId,
            message,
            read: false,
            timestamp: new Date(),
        };

        const createdMessage = await this.chatRepository.saveMessage(chat)
        console.log("created message save ", createdMessage)
        return createdMessage;

    }
}