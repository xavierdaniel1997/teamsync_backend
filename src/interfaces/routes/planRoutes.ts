import express from "express";
import { createPlanController, deletePlanController, getPlansController, updatePlanController } from "../controller/admin/planController";
import { isAuth } from "../middleware/authMiddleware";

const router = express.Router()

router.post("/create-plan", isAuth, createPlanController)
router.put("/update-plan/:id", isAuth, updatePlanController)
router.get("/get-plans", isAuth, getPlansController)
router.delete("/delete-plan/:id", isAuth, deletePlanController)

export default router;