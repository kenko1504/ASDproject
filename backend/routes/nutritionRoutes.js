import express from "express";
import {
    getDailyNutritionRequirements,
} from "../controllers/nutritionController.js";
const router = express.Router();

router.use("/nutrition")

router.get("/dailyReq", getDailyNutritionRequirements)

export default router;