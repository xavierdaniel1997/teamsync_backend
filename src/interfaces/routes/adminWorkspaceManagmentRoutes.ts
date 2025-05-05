import express from 'express';
import { isAdmin } from '../middleware/isAdmin';
import { isAuth } from '../middleware/authMiddleware';
import { getAllWorkspaces } from '../controller/admin/workspaceManagment';

const router = express.Router()

router.get("/workspaces", isAdmin, isAuth, getAllWorkspaces)

export default router;     