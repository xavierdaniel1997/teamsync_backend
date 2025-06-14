import { IChat } from "../../../domain/entities/chat";
import { IChatRepo } from "../../../domain/repositories/chatRepo";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";

export class GetLastMessageUseCase{
    constructor(
        private chatRepo: IChatRepo,
        private projectRepo: IProjectRepo
    ){}

    async execute (projectId: string, currentUserId: string):Promise<{[key: string]: IChat | null}>{

        const members = await this.projectRepo.findMembersByProject(projectId)

        const lastMessages: { [key: string]: IChat | null } = {};

        for(const member of members.members){
            const memberId = member.user._id.toString();
            if(memberId !== currentUserId){
                const lastMessage = await this.chatRepo.getLastMessage(projectId, currentUserId, memberId)
                lastMessages[memberId] = lastMessage
            }
        }

        return lastMessages;
    }
}