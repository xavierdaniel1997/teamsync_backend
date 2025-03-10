import express from 'express'
import {registerUser, resendOtp, sendOtpToEmail, verifyOtp} from '../controller/user/auth/userRegistration'

import { userEmailValidator } from '../../application/validator/userRegisterEmailValidator'
import { userCompleteValidator } from '../../application/validator/userCompleteValidator'
import { validateRequestMiddleware } from '../middleware/validateRequestMiddleware'

const router = express.Router()

router.post("/validateEmail", userEmailValidator, validateRequestMiddleware, sendOtpToEmail)
router.post("/verifyOTP", verifyOtp)
router.post("/resend-Otp", resendOtp)
router.post("/register", userCompleteValidator, validateRequestMiddleware, registerUser)

export default router