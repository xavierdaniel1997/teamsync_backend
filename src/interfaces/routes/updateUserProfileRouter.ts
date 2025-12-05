import express from 'express';
import { getUserDetilas, updateProfile } from '../controller/user/auth/updateProfile';
import { isAuth } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const router = express.Router()

router.put("/update-profile", isAuth, upload.fields([{ name: 'avatar', maxCount: 1 },
{ name: 'coverPhoto', maxCount: 1 }]), updateProfile)
router.get("/user-details", isAuth, getUserDetilas)


export default router;