import express from "express";
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } from "../controllers/recipeController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, requireAdmin, createRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", authenticateToken, requireAdmin, updateRecipe);
router.delete("/:id", authenticateToken, requireAdmin, deleteRecipe);

export default router;