import express from "express";

import { 
    getUserTodayMeal,
    createMeal,
    deleteMeal,
    updateMeal,
    getUserSpecificDayMeal
} from "../controllers/mealController";
const router = express.Router();

router.use("/meal")

router.get("/today", getUserTodayMeal)
router.get("/day", getUserSpecificDayMeal)
router.post("/", createMeal)
router.delete("/:id", deleteMeal)
router.patch("/:id", updateMeal)

export default router