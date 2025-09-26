import express from "express";
<<<<<<< Updated upstream
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } from "../controllers/recipeController.js";

const router = express.Router();

router.post("/", createRecipe);
=======
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, seedDummyRecipes, deleteGeneratedRecipes, cleanupOrphanedReferences } from "../controllers/recipeController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, requireAdmin, createRecipe);
router.post("/seed", authenticateToken, requireAdmin, seedDummyRecipes);
router.delete("/generated", authenticateToken, requireAdmin, deleteGeneratedRecipes);
router.post("/cleanup-orphaned", authenticateToken, requireAdmin, cleanupOrphanedReferences);
>>>>>>> Stashed changes
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;