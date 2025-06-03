import { Socket, Server as SocketIOServer } from "socket.io";
import { socketStore } from "../socketStore/socketStore";

export const handleDisconnect = (io: SocketIOServer, socket: Socket, userId: string) => {
  socketStore.onlineStatus.delete(userId);
  io.emit("onlineStatus", { userId, isonline: false });
  console.log(`User ${userId} is now offline`);
};