import express from 'express';
import { createWorkSpace } from '../controller/user/workSpace/workSpaceController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router()

router.post("/create-work-space", isAuth, createWorkSpace)


export default router