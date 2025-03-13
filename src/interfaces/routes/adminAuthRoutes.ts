import express from 'express'
import { register } from '../controller/admin/registrationAndLogin'

const router = express.Router()

router.post("/registerAdmi", register)

export default router;