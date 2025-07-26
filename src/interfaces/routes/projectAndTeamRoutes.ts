import express from 'express';
import { isAuth } from '../middleware/authMiddleware';
import { createProject, deleteProject, getProjectById, getProjectDetails, getProjects, inviteMemberToProject, updateProject } from '../controller/user/projectAndTeam/projectController';
import { acceptInvitation } from '../controller/user/teamAndInvitation/invitationController';
import { createTask, deleteTaskController, getAllTasksByProject, getEpicByProject, getTaskBySprintStatus, getTaskFromSprint, getTaskInBoard, getTasksController, updateTaskController, updateKanbanTask, getTaskInKanban } from '../controller/user/projectAndTeam/taskController';
import { createSprint, deleteSprint, getSprints, startSprint } from '../controller/user/projectAndTeam/sprintController';
import { upload } from '../middleware/upload';

const router = express.Router()

router.post("/createprojectandteam", isAuth, createProject)  
router.post("/accept-invitation", isAuth, acceptInvitation)
router.get("/all-projects", isAuth, getProjects)
router.get("/project-by-id/:projectId", isAuth, getProjectById)         
router.get("/project-details/:projectId", isAuth, getProjectDetails)  
router.put("/edit-project/:projectId/:workspaceId", isAuth , upload.fields([{name: "projectCoverImg", maxCount: 1}]), updateProject)
router.post("/invite-member/:projectId/:workspaceId", isAuth, inviteMemberToProject)
router.delete("/delete-project/:projectId/:workspaceId", isAuth, deleteProject)


// task routes

router.post("/create-task", isAuth, createTask)
router.get("/project-epics/:projectId", isAuth, getEpicByProject)
// router.put("/update-task/:workspaceId/:projectId/:taskId", isAuth, updateTaskController)
router.put("/update-task/:workspaceId/:projectId/:taskId", isAuth, upload.array('files', 10), updateTaskController)
router.delete("/delete-task/:workspaceId/:projectId/:taskId", isAuth, deleteTaskController)
router.get("/backlog-tasks/:projectId", isAuth, getTasksController)
router.get("/sprint-tasks/:workspaceId/:projectId/:sprintId", isAuth, getTaskFromSprint)
router.get("/all-tasks/:workspaceId/:projectId", isAuth, getAllTasksByProject)
router.get("/taskby-sprintstatus/:workspaceId/:projectId", isAuth, getTaskBySprintStatus)
router.get("/active-tasks/:workspaceId/:projectId", isAuth, getTaskInBoard)
router.put("/update-kanban-task/:workspaceId/:projectId/:taskId", isAuth, updateKanbanTask)
router.get("/kanban-tasks/:workspaceId/:projectId", isAuth, getTaskInKanban)


//sprint routes

router.post("/create-sprint", isAuth, createSprint)          
router.get("/sprints/:projectId", isAuth, getSprints)
router.delete("/delete-sprint/:workspaceId/:projectId/:sprintId", isAuth, deleteSprint)   
router.post("/start-sprint/:workspaceId/:projectId/:sprintId", isAuth, startSprint)



export default router;    
  