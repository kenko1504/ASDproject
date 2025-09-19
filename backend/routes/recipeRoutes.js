import express from "express";
import { createRecipe, getAllRecipes, getRecipeById, deleteRecipe } from "../controllers/recipeController.js";

const router = express.Router();

router.post("/", createRecipe); 
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id", deleteRecipe);

export default router;