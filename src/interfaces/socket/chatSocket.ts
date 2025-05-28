import { Socket, Server as SocketIOServer } from "socket.io";
import { SendMessageUseCase } from "../../application/usecase/chatRoom/sendMessageUseCase";
import { GetMessagesUseCase } from "../../application/usecase/chatRoom/getMessagesUseCase";
import { ChatRepoImpl } from "../../infrastructure/repositories/chatRepoImpl";
import { ProjectRepoImpl } from "../../infrastructure/repositories/projectRepoImpl";

interface AuthenticatedUser {
    userId: string;
    role: string;
    fullName: string;
}

interface AuthenticatedSocket extends Socket {
    user?: AuthenticatedUser;
}

const chatRepo = new ChatRepoImpl();
const projectRepo = new ProjectRepoImpl();
const sendMessageUseCase = new SendMessageUseCase(chatRepo, projectRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo, projectRepo);


export const setupChatSocket = (io: SocketIOServer) => {
    io.on("connection", (socket: AuthenticatedSocket) => {
        console.log("User connected to chatroom :", socket.id);

        const userId = socket.user?.userId;
        if (userId) {
            socket.join(userId)
        }

        socket.on("error", (error) => {
            console.error("Socket authentication error:", error.message);
            socket.emit("error", { message: error.message });
            socket.disconnect();
        });



        socket.on('joinConversation', async ({ projectId, recipientId }: { projectId: string; recipientId: string }) => {
            try {
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                const project = await projectRepo.findUserAccess(projectId, userId);
                if (!project) {
                    throw new Error("Project not found or user does not have access");
                }
                const roomId = [userId, recipientId].sort().join("_");
                socket.join(roomId);
                const messages = await getMessagesUseCase.execute(projectId, recipientId, userId);
                socket.emit("loadMessages", messages);
            } catch (error: any) {
                socket.emit("error", { message: error.message });
            }
        })



        socket.on("sendMessage", async ({ projectId, recipientId, message, tempId }: { projectId: string; recipientId: string; message: string, tempId?: string }) => {
            try {
                if (!userId) {
                    throw new Error('User not authenticated');
                }
                console.log("send message details", projectId, "userId : ", userId, "message : ", message)
                const chatMessage = await sendMessageUseCase.execute(projectId, recipientId, userId, message);
                const roomId = [userId, recipientId].sort().join("_");
                // io.to(roomId).emit("newMessage", chatMessage);
                // io.to(userId).to(recipientId).emit("newMessage", chatMessage);
                const messageWithTempId = { ...chatMessage, tempId };
                io.to(roomId).emit("newMessage", messageWithTempId);
            } catch (error: any) {
                socket.emit("error", { message: error.message });
            }
        })



        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.id)
        })


    })
}