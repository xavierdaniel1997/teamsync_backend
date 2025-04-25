import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { createProject, getProjectById, getProjectDetails, getProjects } from '../controller/user/projectAndTeam/projectController';
import { acceptInvitation } from '../controller/user/teamAndInvitation/invitationController';
import { createTask, getEpicByProject, updateTaskController } from '../controller/user/projectAndTeam/taskController';

const router = express.Router()

router.post("/createprojectandteam", isAuth, createProject)

router.post("/accept-invitation", isAuth, acceptInvitation)
router.get("/all-projects", isAuth, getProjects)
router.get("/project-by-id/:projectId", isAuth, getProjectById)  
router.get("/project-details/:projectId", isAuth, getProjectDetails)


//task routes

router.post("/create-task", isAuth, createTask)
router.get("/project-epics/:projectId", isAuth, getEpicByProject)
router.get("/update-task/:tasdId", isAuth, updateTaskController)
export default router;      