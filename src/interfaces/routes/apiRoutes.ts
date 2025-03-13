import express from 'express'
import userAuthRoute from './userAuthRoutes'
import userProfileRoute from "./updateUserProfileRouter"

import adminAuthRoute from './adminAuthRoutes'

const router = express.Router()

router.use("/auth", userAuthRoute)

router.use("/edit", userProfileRoute)


//admin

router.use("/auth", adminAuthRoute)

export default router;   