import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { socketAuth } from "../interfaces/middleware/authMiddleware";

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
    console.log("from the socket initialatior", process.env.CLIENT_ORIGIN)
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CLIENT_ORIGIN,
            credentials: true,
            methods: ["GET", "POST"],
        },
    });

    io.use((socket: Socket, next) => {
        socketAuth(socket, next);
    });

    return io;
};