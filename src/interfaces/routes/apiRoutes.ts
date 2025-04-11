import express from 'express'
import userAuthRoute from './userAuthRoutes'
import userProfileRoute from "./updateUserProfileRouter"
import workSpaceRoute from './workSpaceRoutes'
import subscribeRoute from './subscriptionRoutes'
import projectAndTeamRoute from "./projectAndTeamRoutes"

import adminAuthRoute from './adminAuthRoutes'
import planRoute from "./planRoutes";
import adminUserManagmentRoute from "./adminUserManagmentRoutes"

const router = express.Router()

router.use("/auth", userAuthRoute)

router.use("/user", userProfileRoute)
router.use("/workSpace", workSpaceRoute)
router.use("/subscriptions", subscribeRoute)
router.use("/project", projectAndTeamRoute)

//admin

router.use("/auth", adminAuthRoute)
router.use("/admin", planRoute)
router.use("/user-managment", adminUserManagmentRoute)

export default router;   