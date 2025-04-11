import express from 'express'
import { isAuth } from '../middleware/authMiddleware'
import { getAllUsers } from '../controller/admin/userManagmentController'
import { isAdmin } from '../middleware/isAdmin'

const router = express.Router()

router.get("/user-details",isAdmin, isAuth, getAllUsers)

export default router;