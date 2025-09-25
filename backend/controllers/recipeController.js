import Recipe from "../models/recipe.js";

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