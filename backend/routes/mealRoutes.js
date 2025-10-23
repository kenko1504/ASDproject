import express from "express";

import { 
    getUserTodayMeal,
    createMeal,
    deleteMeal,
    updateMeal,
    getUserSpecificDayMeal,
    getFoodById
} from "../controllers/mealController.js";
const router = express.Router();


router.get("/:id/:date", getUserSpecificDayMeal)
router.get("/:id", getUserTodayMeal)
router.get("/food/:id", getFoodById)

router.post("/", createMeal)
router.delete("/:id", deleteMeal)
router.patch("/:id", updateMeal)

export default router