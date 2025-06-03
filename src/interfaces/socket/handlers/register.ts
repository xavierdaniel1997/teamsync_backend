import {Server, Socket} from 'socket.io'
import { socketStore } from '../socketStore/socketStore'

export const handleRegister = (io: Server, socket: Socket, userId: string) => {
    socketStore.onlineStatus.set(userId, socket.id)
    const isonline = true;
    socket.emit("registerSuccess", { userId, isonline });   
    io.emit('onlineStatus', {userId, isonline})
    console.log(`User ${userId} is now online and registered successfully`); 
}                                         