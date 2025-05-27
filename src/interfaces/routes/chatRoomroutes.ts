import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { listMembersController } from '../controller/user/chatRoom/listMembers';

const router = express.Router()

router.get("/all-members/:workspaceId/:projectId", isAuth, listMembersController)


export default router;