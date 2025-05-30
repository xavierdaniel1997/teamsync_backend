import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { socketAuth } from "../interfaces/middleware/authMiddleware";

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST"],
        },
    });

    io.use((socket: Socket, next) => {
        socketAuth(socket, next);
    });

    return io;
};