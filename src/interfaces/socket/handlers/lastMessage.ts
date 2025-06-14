import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatRepoImpl } from '../../../infrastructure/repositories/chatRepoImpl';
import { GetLastMessageUseCase } from '../../../application/usecase/chatRoom/getLastMessageUseCase';
import { ProjectRepoImpl } from '../../../infrastructure/repositories/projectRepoImpl';

const chatRepo = new ChatRepoImpl()
const projectRepo = new ProjectRepoImpl()
const getLastMessageUseCase = new GetLastMessageUseCase(chatRepo, projectRepo)

export const handleLastMessage = async (
    io: SocketIOServer,
    socket: Socket,
    projectId: string,
    currentUserId: string
) => {
    try {
        const lastMessages = await getLastMessageUseCase.execute(projectId, currentUserId)
        socket.emit('lastMessages', lastMessages);
    } catch (error) {
        socket.emit('error', { message: `Failed to count the unreaded messages: ${(error as Error).message}` });
    }
}