import express from 'express';
import { updateProfile } from '../controller/user/auth/updateProfile';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router()

router.put("/update-profile", isAuth ,updateProfile)


export default router;