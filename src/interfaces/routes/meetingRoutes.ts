import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { createMeetingController, getMeetingByMembers } from '../controller/user/meeting/meetingController';



const router = express.Router()

router.post('/create-meeting', isAuth, createMeetingController)
router.get('/get-meetings', isAuth, getMeetingByMembers)


export default router;