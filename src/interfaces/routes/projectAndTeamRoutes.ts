import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { createProject, getProjectById, getProjectDetails, getProjects } from '../controller/user/projectAndTeam/projectController';
import { acceptInvitation } from '../controller/user/teamAndInvitation/invitationController';

const router = express.Router()

router.post("/createprojectandteam", isAuth, createProject)

router.post("/accept-invitation", isAuth, acceptInvitation)
router.get("/all-projects", isAuth, getProjects)
router.get("/project-by-id/:projectId", isAuth, getProjectById)  
router.get("/project-details/:projectId", isAuth, getProjectDetails)

export default router;    