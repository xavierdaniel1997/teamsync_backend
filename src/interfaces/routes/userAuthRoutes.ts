import express from 'express'
import {forgetPswViaEmail,  googleLogin,  loginUser, logoutUser, refreshAccessToken, registerUser, resendOtp, resetPassword, sendOtpToEmail, verifyOtp} from '../controller/user/auth/userRegistration'

import { userEmailValidator } from '../../application/validator/userRegisterEmailValidator'
import { userCompleteValidator } from '../../application/validator/userCompleteValidator'
import { validateRequestMiddleware } from '../middleware/validateRequestMiddleware'
import { userLoginValidator } from '../../application/validator/useLoginValidator'

const router = express.Router()

router.post("/validateEmail", userEmailValidator, validateRequestMiddleware, sendOtpToEmail)
router.post("/verifyOTP", verifyOtp)
router.post("/resend-Otp", resendOtp)
router.post("/register", userCompleteValidator, validateRequestMiddleware, registerUser)
router.post("/loginUser", userLoginValidator, validateRequestMiddleware, loginUser)
router.post("/logout", logoutUser)

router.post("/google", googleLogin)


router.post("/forgotPasswordEmail", forgetPswViaEmail)
router.post("/resetpassword/:token", resetPassword)

router.post("/refresh-token", refreshAccessToken);


export default router