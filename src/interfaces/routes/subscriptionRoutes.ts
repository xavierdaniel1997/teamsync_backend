import express from 'express'
import { isAuth } from '../middleware/authMiddleware'
import { createSubscription, currentSubscription } from '../controller/user/subscriptions/subscriptionController'

const router = express.Router()

router.post("/create", isAuth, createSubscription)
router.get("/current-subscription", isAuth, currentSubscription)

export default router;