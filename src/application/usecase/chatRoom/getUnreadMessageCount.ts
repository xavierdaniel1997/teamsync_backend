import { IChatRepo } from "../../../domain/repositories/chatRepo";


export class GetUnreadMessageCountUseCase {
    constructor(
        private chatRepo: IChatRepo
    ) { }

    async execute(projectId: string, recipientId: string): Promise<{ senderId: string; count: number }[]> {
       const messageCount = await this.chatRepo.getUnreadMessageCount(projectId, recipientId)
       return messageCount;
    }

}