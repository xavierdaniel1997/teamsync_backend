import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { createProject } from '../controller/user/projectAndTeam/projectController';

const router = express.Router()

router.post("/createprojectandteam", isAuth, createProject)

export default router;