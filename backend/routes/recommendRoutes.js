import express from "express";
import { searchByQuery } from "../controllers/recommendController.js";

const router = express.Router();

router.get("/search", searchByQuery);
export default router;