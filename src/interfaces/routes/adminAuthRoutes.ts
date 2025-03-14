import express from 'express'
import { adminLogin, adminLogout, register } from '../controller/admin/registrationAndLogin'

const router = express.Router()

router.post("/registerAdmi", register)
router.post("/loginAdmin", adminLogin)
router.post("/logoutAdmin", adminLogout)

export default router;