import { IChat } from "../../../domain/entities/chat";
import { IChatRepo } from "../../../domain/repositories/chatRepo";

export class MarkMessageAsReadUseCase {
    constructor(
        private chatRepo: IChatRepo
    ) { }

    async execute(messageId: string): Promise<IChat | null> {

        const message = await this.chatRepo.findMessage(messageId)
        if (!message) {
            throw new Error("message not found")
        }
        //  console.log("form the markmessageas read usecase message", message)
        const updateMessage = await this.chatRepo.markMessagesAsRead(messageId)
        if (!updateMessage) {
            throw new Error("message not update")
        }
        // console.log("form the markmessageas read usecase updatedMessage", updateMessage)  
        return updateMessage;
    }
}
