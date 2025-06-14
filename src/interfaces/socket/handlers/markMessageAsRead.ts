import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatRepoImpl } from '../../../infrastructure/repositories/chatRepoImpl';
import { MarkMessageAsReadUseCase } from '../../../application/usecase/chatRoom/markMessageAsReadUseCase';
import { read } from 'fs';
import { GetUnreadMessageCountUseCase } from '../../../application/usecase/chatRoom/getUnreadMessageCount';

const chatRepo = new ChatRepoImpl()
const markMessageAsReadUseCase = new MarkMessageAsReadUseCase(chatRepo)
const getUnreadMessageCountUseCase = new GetUnreadMessageCountUseCase(chatRepo)

export const handleMarkMessageAsRead = async (
    io: SocketIOServer,
    socket: Socket,
    messageId: string,
    userId: string
) => {
    try {
        const message = await markMessageAsReadUseCase.execute(messageId)
        if (!message) {
            socket.emit("error", { message: "Message not found" });
            return;
        }

        const senderRoom = message.senderId.toString();
        io.to(message.senderId.toString()).emit('messageRead', {
            messageId: message._id?.toString(),
            read: message.read
        })
        console.log('Emitted messageRead to sender room:', { senderRoom, messageId: message._id?.toString() });
        const recipientId = message.recipientId.toString()
        const unreadCounts = await getUnreadMessageCountUseCase.execute(message.projectId.toString(), recipientId);
        console.log('Emitting unreadCounts to recipient..........................:', userId, unreadCounts);
        io.to(recipientId).emit('unreadCounts', unreadCounts);

    } catch (error: any) {
        socket.emit('error', { message: `Failed to mark message as read: ${(error as Error).message}` }); 
    }
}