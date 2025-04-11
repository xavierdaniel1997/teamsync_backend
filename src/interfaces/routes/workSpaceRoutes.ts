import express from 'express';
import { createWorkSpace, getInvitedWorkSpace, getWorkSpace } from '../controller/user/workSpace/workSpaceController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router()

router.post("/create-work-space", isAuth, createWorkSpace)
router.get("/get-workspace", isAuth, getWorkSpace)
router.get("/get-invited-workspace", isAuth, getInvitedWorkSpace)


export default router