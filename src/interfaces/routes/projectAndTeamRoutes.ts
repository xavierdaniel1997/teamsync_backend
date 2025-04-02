import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { createProject } from '../controller/user/projectAndTeam/projectController';
import { acceptInvitation } from '../controller/user/teamAndInvitation/invitationController';

const router = express.Router()

router.post("/createprojectandteam", isAuth, createProject)

router.post("/accept-invitation", isAuth, acceptInvitation)

export default router;