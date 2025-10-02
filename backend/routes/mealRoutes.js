import express from "express";

import { 
    getUserTodayMeal,
    createMeal,
    deleteMeal,
    updateMeal,
    getUserSpecificDayMeal
} from "../controllers/mealController.js";
const router = express.Router();


router.get("/today", getUserTodayMeal)
router.get("/day", getUserSpecificDayMeal)
router.post("/", createMeal)
router.delete("/:id", deleteMeal)
router.patch("/:id", updateMeal)

export default router