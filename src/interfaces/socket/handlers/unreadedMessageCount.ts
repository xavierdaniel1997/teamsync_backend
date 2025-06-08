import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatRepoImpl } from '../../../infrastructure/repositories/chatRepoImpl';
import { GetUnreadMessageCountUseCase } from '../../../application/usecase/chatRoom/getUnreadMessageCount';
import { ProjectRepoImpl } from '../../../infrastructure/repositories/projectRepoImpl';

const chatRepo = new ChatRepoImpl()
const projectRepo = new ProjectRepoImpl()
const getUnreadMessageCountUseCase = new GetUnreadMessageCountUseCase(chatRepo)

export const handleUnreadedMessageCount = async (
    io: SocketIOServer,
    socket: Socket,
    projectId: string,
    recipientId: string
) => {
    try {
 
        const unreadCounts = await getUnreadMessageCountUseCase.execute(projectId, recipientId);
        socket.emit('unreadCounts', unreadCounts);   
    } catch (error: any) {
        socket.emit('error', { message: `Failed to count the unreaded messages: ${(error as Error).message}` });
    }
}