import express from 'express'
import { isAuth } from '../middleware/authMiddleware'
import { createSubscription } from '../controller/user/subscriptions/subscriptionController'

const router = express.Router()

router.post("/create", isAuth, createSubscription)

export default router;