import express from "express";
import { createUser, deleteUser, updateUser, getSavedRecipes, addSavedRecipe, removeSavedRecipe } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

// Saved recipes routes
router.get("/:userId/saved-recipes", getSavedRecipes);
router.post("/:userId/saved-recipes", addSavedRecipe);
router.delete("/:userId/saved-recipes", removeSavedRecipe);

export default router;