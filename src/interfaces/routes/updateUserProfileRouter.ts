import express from 'express';
import { getUserDetilas, updateProfile } from '../controller/user/auth/updateProfile';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router()

router.put("/update-profile", isAuth ,updateProfile)
router.get("/user-details", isAuth, getUserDetilas)


export default router;