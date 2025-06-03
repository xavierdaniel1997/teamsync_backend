import { Socket } from "socket.io"
import { socketStore } from "../socketStore/socketStore"

export const handleCheckOnline = (socket: Socket, targetId: string) => {
    const isonline = socketStore.onlineStatus.has(targetId)
    socket.emit('onlineStatus', {userId: targetId, isonline})
} 