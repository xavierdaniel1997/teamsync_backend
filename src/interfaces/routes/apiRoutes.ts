import express from 'express'
import userAuthRoute from './userAuthRoutes'
import userProfileRoute from "./updateUserProfileRouter"

import workSpaceRoute from './workSpaceRoutes'

import adminAuthRoute from './adminAuthRoutes'

const router = express.Router()

router.use("/auth", userAuthRoute)

router.use("/edit", userProfileRoute)
router.use("/workSpace", workSpaceRoute)

//admin

router.use("/auth", adminAuthRoute)

export default router;   