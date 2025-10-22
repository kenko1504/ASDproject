import express from "express";
import { addToLatestGroceryList, searchByQuery, getListByNutritions} from "../controllers/recommendController.js";

const router = express.Router();

router.get("/search", searchByQuery);
router.post("/:uid/grocery", addToLatestGroceryList);
router.post("/:uid/nutritionBasedSearch", getListByNutritions)
export default router;