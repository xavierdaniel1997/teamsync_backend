import { Socket, Server as SocketIOServer } from "socket.io";
import { ChatRepoImpl } from "../../../infrastructure/repositories/chatRepoImpl";
import { ProjectRepoImpl } from "../../../infrastructure/repositories/projectRepoImpl";
import { CreateMessageUseCase } from "../../../application/usecase/chatRoom/createMessageUseCase";


const chatRepo = new ChatRepoImpl();
const projectRepo = new ProjectRepoImpl();
const createMessageUseCase = new CreateMessageUseCase(chatRepo, projectRepo);

export const handleSendMessage = async (
    io: SocketIOServer,
    socket: Socket,
    projectId: string,
    senderId: string,
    recipientId: string,
    message: string,           
) => {
    console.log("message form the user", message)
    try {
        const chatMessage = await createMessageUseCase.execute({
            projectId,
            senderId,
            recipientId,
            message,
        })
        io.to(senderId).to(recipientId).emit('receiveMessage', chatMessage)
    } catch (error: any) {
        console.error("Error sending message:", error.message);
        socket.emit("error", { message: error.message || "Failed to send message" });
    }

}