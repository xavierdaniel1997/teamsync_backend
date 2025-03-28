import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import apiRoute from './interfaces/routes/apiRoutes';
import errorMiddleware from './interfaces/middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { handleWebhook } from './interfaces/controller/user/subscriptions/webhookController';

const app: Application = express()

const PORT: Number = 5000;

dotenv.config()
connectDB()
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))


app.post("/api/webhook", express.raw({type: "application/json"}), handleWebhook)
app.use(express.json())
app.get("/", (req:Request, res:Response) => {
    res.json({message: "teamsync server test message"})
})

app.use("/api", apiRoute)

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`server starts at PORT ${PORT}`)
})