import { Server } from 'socket.io'
import { socketStore } from '../socketStore/socketStore';
import { handleStopTyping } from './stopTyping';


export const handleStartTyping = (
    io: Server,
    senderId: string,
    recipientId: string,
) => {
    if(!senderId || !recipientId){
        console.error('Invalid senderId or recipientId in handleStartTyping')
        return;
    }

    const existingTyping = socketStore.typingStatus.get(senderId);
    if(existingTyping?.timeoutId){
        clearTimeout(existingTyping.timeoutId)
    }

    socketStore.typingStatus.set(senderId, {recipientId})

    io.to(recipientId).emit('typing', {senderId})

    const timeoutId = setTimeout(() => {
        handleStopTyping(io, senderId, recipientId)
    }, 4000)

    socketStore.typingStatus.set(senderId, {recipientId, timeoutId})
}