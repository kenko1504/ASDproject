import Recipe from "../models/recipe.js";
import Food from "../models/food.js";
import User from "../models/user.js";
import { generateRandomizedRecipes } from "../utils/dummyRecipes.js";

// Create new Recipe
export const createRecipe = async (req, res) => {
  try {
    const { name, cookTime, difficulty, description, ingredients, instructions, image } = req.body;
    
    // Validate required fields
    if (!name || !cookTime || !difficulty || !description || !ingredients || !instructions || !image) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const newRecipe = new Recipe({
      name,
      cookTime: parseInt(cookTime),
      difficulty,
      description,
      ingredientNo: ingredients.length,
      image, 
      ingredients,
      instructions
    });

    await newRecipe.save();
    
    // Populate the ingredients with food data before returning
    const populatedRecipe = await Recipe.findById(newRecipe._id).populate('ingredients.ingredient');
    
    res.status(201).json(populatedRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('ingredients.ingredient');
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('ingredients.ingredient');
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const { name, cookTime, difficulty, description, ingredients, instructions, image } = req.body;

    // Validate required fields
    if (!name || !cookTime || !difficulty || !description || !ingredients || !instructions || !image) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        name,
        cookTime: parseInt(cookTime),
        difficulty,
        description,
        ingredientNo: ingredients.length,
        image,
        ingredients,
        instructions
      },
      { new: true }
    ).populate('ingredients.ingredient');

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Seed dummy recipes (Admin only)
export const seedDummyRecipes = async (req, res) => {
  try {
    // Get some random foods from the database for ingredients
    const foods = await Food.find().limit(50);

    // Get image URLs from request body (sent from frontend with correct imported paths)
    const { imageUrls } = req.body;

    // Generate randomized dummy recipes with correct image URLs
    const dummyRecipes = generateRandomizedRecipes(foods, 10, imageUrls);

    // Create recipes with proper ingredient count
    const createdRecipes = [];
    for (const recipeData of dummyRecipes) {
      const recipe = new Recipe({
        ...recipeData,
        ingredientNo: recipeData.ingredients.length,
        isGenerated: true
      });

      const savedRecipe = await recipe.save();
      const populatedRecipe = await Recipe.findById(savedRecipe._id).populate('ingredients.ingredient');
      createdRecipes.push(populatedRecipe);
    }

    res.status(201).json({
      message: `${createdRecipes.length} randomized dummy recipes created successfully`,
      recipes: createdRecipes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to clean up orphaned recipe references from all users
const cleanupOrphanedRecipeReferences = async (recipeIds) => {
  try {
    // Remove orphaned recipe IDs from all users' savedRecipes and recentRecipes arrays
    await User.updateMany(
      {},
      {
        $pull: {
          savedRecipes: { $in: recipeIds },
          recentRecipes: { $in: recipeIds }
        }
      }
    );
  } catch (error) {
    console.error('Error cleaning up orphaned recipe references:', error);
    throw error;
  }
};

// Delete all generated recipes (Admin only)
export const deleteGeneratedRecipes = async (req, res) => {
  try {
    // Find all generated recipes first to get the count and IDs
    const generatedRecipes = await Recipe.find({ isGenerated: true });
    const deletedCount = generatedRecipes.length;

    if (deletedCount === 0) {
      return res.status(200).json({
        message: "No generated recipes found to delete",
        deletedCount: 0,
        usersUpdated: 0
      });
    }

    // Get the recipe IDs that will be deleted
    const recipeIds = generatedRecipes.map(recipe => recipe._id);

    // Delete all generated recipes
    await Recipe.deleteMany({ isGenerated: true });

    // Clean up orphaned references from all users
    await cleanupOrphanedRecipeReferences(recipeIds);

    // Count how many users were affected (for reporting)
    const affectedUsers = await User.countDocuments({
      $or: [
        { savedRecipes: { $in: recipeIds } },
        { recentRecipes: { $in: recipeIds } }
      ]
    });

    res.status(200).json({
      message: `${deletedCount} generated recipes deleted successfully and references cleaned up from users`,
      deletedCount: deletedCount,
      usersUpdated: affectedUsers
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clean up orphaned recipe references for all users (Admin only)
export const cleanupOrphanedReferences = async (req, res) => {
  try {
    // Get all existing recipe IDs
    const existingRecipes = await Recipe.find({}, '_id');
    const existingRecipeIds = existingRecipes.map(recipe => recipe._id);

    // Find all users with recipe references
    const users = await User.find({
      $or: [
        { savedRecipes: { $exists: true, $ne: [] } },
        { recentRecipes: { $exists: true, $ne: [] } }
      ]
    });

    let totalCleaned = 0;
    let usersAffected = 0;

    // Process each user
    for (const user of users) {
      let userModified = false;

      // Clean savedRecipes
      if (user.savedRecipes && user.savedRecipes.length > 0) {
        const validSavedRecipes = user.savedRecipes.filter(recipeId =>
          existingRecipeIds.some(existingId => existingId.equals(recipeId))
        );

        if (validSavedRecipes.length !== user.savedRecipes.length) {
          totalCleaned += user.savedRecipes.length - validSavedRecipes.length;
          user.savedRecipes = validSavedRecipes;
          userModified = true;
        }
      }

      // Clean recentRecipes
      if (user.recentRecipes && user.recentRecipes.length > 0) {
        const validRecentRecipes = user.recentRecipes.filter(recipeId =>
          existingRecipeIds.some(existingId => existingId.equals(recipeId))
        );

        if (validRecentRecipes.length !== user.recentRecipes.length) {
          totalCleaned += user.recentRecipes.length - validRecentRecipes.length;
          user.recentRecipes = validRecentRecipes;
          userModified = true;
        }
      }

      // Save user if modified
      if (userModified) {
        user.updatedAt = Date.now();
        await user.save();
        usersAffected++;
      }
    }

    res.status(200).json({
      message: `Cleanup completed: ${totalCleaned} orphaned recipe references removed from ${usersAffected} users`,
      orphanedReferencesRemoved: totalCleaned,
      usersAffected: usersAffected
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};