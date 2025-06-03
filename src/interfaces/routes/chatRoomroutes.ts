import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { listMembersController } from '../controller/user/chatRoom/listMembers';
import { getMessageController } from '../controller/user/chatRoom/getMessageController';


const router = express.Router()

router.get("/all-members/:workspaceId/:projectId", isAuth, listMembersController)
router.get('/messages', isAuth, getMessageController)


export default router;