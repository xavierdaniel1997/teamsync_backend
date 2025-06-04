import { Server } from "socket.io";
import { socketStore } from "../socketStore/socketStore";

export const handleStopTyping = (
    io: Server,
    senderId: string,
    recipientId: string,
) => {
    if (!senderId || !recipientId) {
        console.error('Invalid senderId or recipientId in handleStopTyping');
        return;
    }

    const typingStatus = socketStore.typingStatus.get(senderId);
    if (typingStatus?.recipientId !== recipientId) {
        return;
    }

    if(typingStatus?.timeoutId){
        clearTimeout(typingStatus.timeoutId)
    }
    socketStore.typingStatus.delete(senderId);

    io.to(recipientId).emit('stopTyping', {senderId})
}