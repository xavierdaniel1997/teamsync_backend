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
import MeetingModel from "../../infrastructure/database/meetingModel";

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
        console.log("User connected to chatroom :", socket.id);

        const userId = socket.user?.userId;
        if (userId) {
            socket.join(userId)
            // console.log("checking the user form the chatSocket", userId)
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

        socket.on('markMessageAsRead', async ({ messageId }: { messageId: string }) => {
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


        socket.on('typing', ({ senderId, recipientId }: { senderId: string, recipientId: string }) => {
            handleStartTyping(io, senderId, recipientId)
        })

        socket.on('stopTyping', ({ senderId, recipientId }: { senderId: string, recipientId: string }) => {
            handleStopTyping(io, senderId, recipientId)
        })

        // video call sockets

        socket.on('initiateCall', ({ callerId, recipientId, callerName, roomID }) => {
            if (socket.user?.userId !== callerId) {
                socket.emit('error', { message: 'Unauthorized call attempt' });
                return;
            }
            io.to(recipientId).emit('incomingCall', { callerId, roomID, callerName });
        })

        socket.on('rejectCall', ({ callerId, roomID }) => {
            io.to(callerId).emit('callRejected', { roomID });
        });

        socket.on('endCall', ({ recipientId, roomID }) => {
            io.to(recipientId).emit('callEnded', { roomID });
        });

        // Group meeting events

        socket.on('startGroupMeeting', async ({ meetingId, roomId, initiatorId, initiatorName, participantIds }) => {
            console.log("form the startGroupMeeting trigred", meetingId, roomId, initiatorId, initiatorName, participantIds)
            if (socket.user?.userId !== initiatorId) {
                socket.emit('error', { message: 'Unauthorized meeting start attempt' });
                return;
            } 
            try {
                await MeetingModel.findOneAndUpdate(
                    { meetingId },
                    { status: 'ongoing' },
                    { new: true }
                );
                participantIds.forEach((id: string) => {
                    io.to(id).emit('incomingGroupMeeting', { meetingId, roomId, initiatorId, initiatorName });
                });
            } catch (error: any) {
                console.error('Error starting group meeting:', error);
                socket.emit('error', { message: 'Failed to start meeting' });
            }
        })


        socket.on('joinGroupMeeting', async ({ meetingId, roomId, userId }) => {
            if (socket.user?.userId !== userId) {
                socket.emit('error', { message: 'Unauthorized join attempt' });
                return;
            }
            try {
                const meeting = await MeetingModel.findOne({ meetingId });
                if (!meeting || meeting.status !== 'ongoing') {
                    socket.emit('error', { message: 'Meeting not available' });
                    return;
                }
                io.to(meetingId).emit('userJoinedMeeting', { userId });
            } catch (error) {   
                console.error('Error joining group meeting:', error);
                socket.emit('error', { message: 'Failed to join meeting' });
            }
        });

        socket.on('endGroupMeeting', async ({ meetingId, roomId, participantIds }) => {
            console.log("group end ", meetingId, roomId)
            try {
                await MeetingModel.findOneAndUpdate(
                    { meetingId },
                    { status: 'ended' },
                    { new: true }
                );
                participantIds.forEach((id: string) => {
                    io.to(id).emit('groupMeetingEnded', { meetingId, roomId });
                });
            } catch (error) {
                console.error('Error ending group meeting:', error);
                socket.emit('error', { message: 'Failed to end meeting' });
            }
        });

        socket.on("disconnect", () => {
            if (userId) {
                handleDisconnect(io, socket, userId);
            }
            console.log("User disconnected: ", socket.id)
        })


    })
}  