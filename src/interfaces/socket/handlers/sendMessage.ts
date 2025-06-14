import { Socket, Server as SocketIOServer } from "socket.io";
import { ChatRepoImpl } from "../../../infrastructure/repositories/chatRepoImpl";
import { ProjectRepoImpl } from "../../../infrastructure/repositories/projectRepoImpl";
import { CreateMessageUseCase } from "../../../application/usecase/chatRoom/createMessageUseCase";
import { GetUnreadMessageCountUseCase } from "../../../application/usecase/chatRoom/getUnreadMessageCount";


const chatRepo = new ChatRepoImpl();
const projectRepo = new ProjectRepoImpl();
const createMessageUseCase = new CreateMessageUseCase(chatRepo, projectRepo);
const getUnreadMessageCountUseCase = new GetUnreadMessageCountUseCase(chatRepo)

export const handleSendMessage = async (
    io: SocketIOServer,
    socket: Socket,
    projectId: string,
    senderId: string,
    recipientId: string,
    message: string,
) => {
    try {
        const chatMessage = await createMessageUseCase.execute({
            projectId,
            senderId,
            recipientId,
            message,
        })
        io.to(senderId).to(recipientId).emit('receiveMessage', chatMessage)

        const unreadCounts = await getUnreadMessageCountUseCase.execute(projectId, recipientId);
        io.to(recipientId).emit('unreadCounts', unreadCounts);
        io.to(senderId).to(recipientId).emit('updateLastMessage', {
            senderId,
            recipientId,
            lastMessage: chatMessage,
        });
    } catch (error: any) {
        console.error("Error sending message:", error.message);
        socket.emit("error", { message: error.message || "Failed to send message" });
    }

}