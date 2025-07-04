import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import apiRoute from './interfaces/routes/apiRoutes';
import errorMiddleware from './interfaces/middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { handleWebhook } from './interfaces/controller/user/subscriptions/webhookController';
import { configureCloudinary } from './config/cloudinary';
import { initializeSocket } from './config/socket';
import {createServer} from 'http';
import { setupChatSocket } from './interfaces/socket/chatSocket';
import { setSocketIO } from './interfaces/controller/user/projectAndTeam/taskController';
import { rateLimit } from 'express-rate-limit'

const app: Application = express()
const server = createServer(app)
const io = initializeSocket(server)


   
const PORT: Number = 5000;
    
dotenv.config()
configureCloudinary();
connectDB()
app.use(cookieParser())


const allowedOrigins = process.env.CLIENT_ORIGIN
app.use(cors({
    origin : allowedOrigins,
    credentials : true,                
    allowedHeaders: ["Content-Type", "Authorization"]
}))

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 180, 
	standardHeaders: 'draft-8',
	legacyHeaders: false,
})

// app.use("/api", rateLimiter)

app.post("/api/webhook", express.raw({type: "application/json"}), handleWebhook)
app.use(express.json())
app.get("/", (req:Request, res:Response) => {
    res.json({message: "teamsync server test message"})
})

app.use("/api", apiRoute) 

app.use(errorMiddleware)


setupChatSocket(io)
setSocketIO(io)

server.listen(PORT, () => {
    console.log(`server starts at PORT ${PORT}`)
})


