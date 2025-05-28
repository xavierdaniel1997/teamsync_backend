import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { listMembersController } from '../controller/user/chatRoom/listMembers';
import { getMessagesController } from '../controller/user/chatRoom/getMessagesController';

const router = express.Router()

router.get("/all-members/:workspaceId/:projectId", isAuth, listMembersController)
router.get("/messages/:projectId", isAuth, getMessagesController);


export default router;