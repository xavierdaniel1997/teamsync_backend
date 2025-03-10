import express from 'express'
import userAuthRoute from './userAuthRoutes'

const router = express.Router()

router.use("/auth", userAuthRoute)

export default router;