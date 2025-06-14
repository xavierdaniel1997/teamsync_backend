import { Socket, Server as SocketIOServer } from "socket.io";
import { ChatRepoImpl } from "../../infrastructure/repositories/chatRepoImpl";
import { ProjectRepoImpl } from "../../infrastructure/repositories/projectRepoImpl";
import { handleRegister } from "./handlers/register";
import { handleCheckOnline } from "./handlers/checkOnline";
import { handleDisconnect } from "./handlers/disconnect";
import { handleSendMessage } from "./handlers/sendMessage";
import { handleStartTyping } from "./handlers/startTyping";
import { handleMarkMessageAsRead } from "./handlers/markMessageAsRead";
import { handleStopTyping } from "./handlers/stopTyping";
import { handleUnreadedMessageCount } from "./handlers/unreadedMessageCount";
import { handleLastMessage } from "./handlers/lastMessage";

interface AuthenticatedUser {
    userId: string;
    role: string;
    fullName: string;
}

interface AuthenticatedSocket extends Socket {
    user?: AuthenticatedUser;
}

// const chatRepo = new ChatRepoImpl();
// const projectRepo = new ProjectRepoImpl();


export const setupChatSocket = (io: SocketIOServer) => {
    io.on("connection", (socket: AuthenticatedSocket) => {
        // console.log("User connected to chatroom :", socket.id);

        const userId = socket.user?.userId;
        if (userId) {
            socket.join(userId)
        }

        socket.on("error", (error) => {
            console.error("Socket authentication error:", error.message);
            socket.emit("error", { message: error.message });
            socket.disconnect();
        });

        //socket coustom events  

        socket.on("register", (userId: string) => {
            if (socket.user?.userId === userId) {
                handleRegister(io, socket, userId);
            } else {
                socket.emit("error", { message: "Unauthorized registration attempt" });
            }
        });

        socket.on('onlineStatus', (targetId: string) => {
            handleCheckOnline(socket, targetId)
        })


        socket.on('sendMessage', async ({ projectId, recipientId, message }: { projectId: string, recipientId: string, message: string }) => {
            if (!socket.user?.userId) {
                socket.emit("error", { message: "User not authenticated" });
                return;
            }

            const senderId = socket.user.userId;

            if (!projectId || !recipientId || !message) {
                socket.emit("error", { message: "Missing required fields" });
                return;
            }

            try {
                await handleSendMessage(io, socket, projectId, senderId, recipientId, message)
            } catch (error) {
                console.error("Error in sendMessage event:", error);  
                socket.emit("error", { message: "Failed to send message" });  
            }   

        })

        socket.on('markMessageAsRead', async ({messageId}: {messageId: string}) => {    
            const userId = socket.user?.userId  
            await handleMarkMessageAsRead(io, socket, messageId, userId!)
        })

        socket.on('fetchUnreadCounts', async (projectId: string) => {
            const recipientId = socket.user?.userId 
            await handleUnreadedMessageCount(io, socket, projectId, recipientId!)    
        })

        socket.on('fetchLastMessage', async (projectId: string) => {
            const currentUserId = socket.user?.userId;
            await handleLastMessage(io, socket, projectId, currentUserId!)
        })

      
        socket.on('typing', ({senderId, recipientId}: {senderId: string, recipientId: string}) => {
            handleStartTyping(io, senderId, recipientId)  
        })
 
        socket.on('stopTyping', ({senderId, recipientId} : {senderId: string, recipientId: string}) => {
            handleStopTyping(io, senderId, recipientId)
        })

        // video call sockets

        

        

        socket.on("disconnect", () => {
            if (userId) {
                handleDisconnect(io, socket, userId);
            }
            console.log("User disconnected: ", socket.id)
        })


    })
}  