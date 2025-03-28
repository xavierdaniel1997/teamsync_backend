import express from 'express';
import { createWorkSpace, getWorkSpace } from '../controller/user/workSpace/workSpaceController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router()

router.post("/create-work-space", isAuth, createWorkSpace)
router.get("/get-workspace", isAuth, getWorkSpace)


export default router