
import { GetMessagesDto } from "../../../domain/dtos/chatDTO";
import { IChat } from "../../../domain/entities/chat";
import { IChatRepo } from "../../../domain/repositories/chatRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";

export class GetMessageUseCase {
    constructor(
        private chatRepository: IChatRepo,
        private projectRepository: IProjectRepo
    ) { }

    async execute(dto: GetMessagesDto, currentUserId: string): Promise<IChat[]> {
        const { projectId, recipientId } = dto;
        // if (!projectId || !recipientId) {
        //     throw new Error("Missing required fields");
        // }

        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        const isMember = project.members.some(
            (member: any) => member.user._id.toString() === currentUserId
        );
        if (!isMember) {
            throw new Error("Unauthorized access: User is not a project member");
        }

        const message = await this.chatRepository.getConversation(projectId, currentUserId, recipientId)
        console.log("message form the get message usecase", message)
        return message;
    }
}