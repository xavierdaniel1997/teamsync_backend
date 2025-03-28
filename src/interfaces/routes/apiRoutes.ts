import express from 'express'
import userAuthRoute from './userAuthRoutes'
import userProfileRoute from "./updateUserProfileRouter"
import workSpaceRoute from './workSpaceRoutes'
import subscribeRoute from './subscriptionRoutes'

import adminAuthRoute from './adminAuthRoutes'
import planRoute from "./planRoutes";

const router = express.Router()

router.use("/auth", userAuthRoute)

router.use("/edit", userProfileRoute)
router.use("/workSpace", workSpaceRoute)
router.use("/subscriptions", subscribeRoute)

//admin

router.use("/auth", adminAuthRoute)
router.use("/admin", planRoute)

export default router;   