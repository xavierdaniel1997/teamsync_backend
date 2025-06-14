import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { deleteNotificationController, getNotificationsController, updateNotificationController } from '../controller/user/notification/notification';


const router = express.Router()

router.get('/my-notifications', isAuth, getNotificationsController)
router.put('/mark-as-read/:notificationId', isAuth, updateNotificationController)
router.delete('/delete-notification/:notificationId', isAuth, deleteNotificationController);

export default router;    