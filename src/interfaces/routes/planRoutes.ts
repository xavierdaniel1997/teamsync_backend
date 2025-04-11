import express from "express";
import { createPlanController, deletePlanController, getPlansController, updatePlanController } from "../controller/admin/planController";
import { isAuth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router()

router.post("/create-plan",isAdmin, isAuth, createPlanController)
router.put("/update-plan/:id", isAuth, updatePlanController)
router.get("/get-plans", isAuth, getPlansController)
router.delete("/delete-plan/:id",isAdmin, isAuth, deletePlanController)

export default router;   