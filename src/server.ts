import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import apiRoute from './interfaces/routes/apiRoutes';
import errorMiddleware from './interfaces/middleware/errorMiddleware';
import cookieParser from 'cookie-parser';

const app: Application = express()

const PORT: Number = 5000;

dotenv.config()
connectDB()
app.use(cookieParser())
app.use(express.json())

app.get("/", (req:Request, res:Response) => {
    res.json({message: "teamsync server test message"})
})

app.use("/api", apiRoute)

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`server starts at PORT ${PORT}`)
})