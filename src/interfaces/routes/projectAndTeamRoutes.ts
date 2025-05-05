import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { createProject, getProjectById, getProjectDetails, getProjects, updateProject } from '../controller/user/projectAndTeam/projectController';
import { acceptInvitation } from '../controller/user/teamAndInvitation/invitationController';
import { createTask, getEpicByProject, getTasksController, updateTaskController } from '../controller/user/projectAndTeam/taskController';
import { createSprint, deleteSprint, getSprints } from '../controller/user/projectAndTeam/sprintController';
import { upload } from '../middleware/upload';

const router = express.Router()

router.post("/createprojectandteam", isAuth, createProject)
router.post("/accept-invitation", isAuth, acceptInvitation)
router.get("/all-projects", isAuth, getProjects)
router.get("/project-by-id/:projectId", isAuth, getProjectById)  
router.get("/project-details/:projectId", isAuth, getProjectDetails)
router.put("/edit-project/:projectId/:workspaceId", isAuth , upload.fields([{name: "projectCoverImg", maxCount: 1}]), updateProject)



router.post("/create-task", isAuth, createTask)
router.get("/project-epics/:projectId", isAuth, getEpicByProject)
router.put("/update-task/:tasdId", isAuth, updateTaskController)
router.get("/backlog-tasks/:projectId", isAuth, getTasksController)


//sprint routes

router.post("/create-sprint", isAuth, createSprint)    
router.get("/sprints/:projectId", isAuth, getSprints)
router.delete("/delete-sprint/:sprintId", isAuth, deleteSprint)   



export default router;    
  