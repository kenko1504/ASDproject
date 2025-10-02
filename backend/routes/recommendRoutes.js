import express from "express";
import { addToLatestGroceryList, searchByQuery } from "../controllers/recommendController.js";

const router = express.Router();

router.get("/search", searchByQuery);
router.post("/:uid/grocery", addToLatestGroceryList);
export default router;