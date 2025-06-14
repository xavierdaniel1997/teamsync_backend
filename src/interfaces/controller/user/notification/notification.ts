import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { INotificationRepoImpl } from "../../../../infrastructure/repositories/notificationRepoImpl";
import { GetNotificationsUseCase } from "../../../../application/usecase/notificationUseCase/getNotificationsUseCase";
import { UpdateNotificationUseCase } from "../../../../application/usecase/notificationUseCase/updateNotificationUseCase";
import { DeleteNotificationUseCase } from "../../../../application/usecase/notificationUseCase/deleteNotificationUseCase";


const notificationRepo = new INotificationRepoImpl()
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepo)
const updateNotificationUseCase = new UpdateNotificationUseCase(notificationRepo)
const deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepo)

const getNotificationsController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const filter = req.query.filter as 'all' | 'read' | 'unread' | undefined;
        const notifications = await getNotificationsUseCase.execute(userId, filter)
        sendResponse(res, 200, notifications, "successfully fetch the notifications")                                
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "Failed to fetch the notification")
    }
}

const updateNotificationController = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        if(!userId){
            throw new Error("userId is missing")
        }
        const {notificationId} = req.params;
        const notificatin = await updateNotificationUseCase.execute(notificationId, userId)
        sendResponse(res, 200, notificatin, "notification updated successfully")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to update the notification")
    }
}


const deleteNotificationController = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user?.userId;
        if(!userId){
            throw new Error("userId is missing")
        }
        const {notificationId} = req.params;
        await deleteNotificationUseCase.execute(notificationId, userId)
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to delete the notification")
    }
}



export { getNotificationsController, updateNotificationController, deleteNotificationController };