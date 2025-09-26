import User from "../models/user.js"
import bcrypt from "bcrypt"


// Create new User
export const createUser = async (req, res) => {
  try {
    const { username, email, password} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const updateFields = {};

    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateFields.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all saved recipes for a user
export const getSavedRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('savedRecipes');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.savedRecipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a recipe to user's saved recipes
export const addSavedRecipe = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if recipe is already saved
    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ error: "Recipe already saved" });
    }

    user.savedRecipes.push(recipeId);
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Recipe saved successfully", savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a recipe from user's saved recipes
export const removeSavedRecipe = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if recipe is in saved recipes
    if (!user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ error: "Recipe not found in saved recipes" });
    }

    user.savedRecipes = user.savedRecipes.filter(id => !id.equals(recipeId));
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Recipe removed successfully", savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
<<<<<<< Updated upstream
=======
};

// Add a recipe to user's recent recipes
export const addRecentRecipe = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Initialize recentRecipes if it doesn't exist
    if (!user.recentRecipes) {
      user.recentRecipes = [];
    }

    // Remove recipe if it already exists in the list
    user.recentRecipes = user.recentRecipes.filter(id => !id.equals(recipeId));

    // Add recipe to the front of the list
    user.recentRecipes.unshift(recipeId);

    // Keep only the 10 most recent recipes
    if (user.recentRecipes.length > 10) {
      user.recentRecipes = user.recentRecipes.slice(0, 10);
    }

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Recent recipe updated successfully", recentRecipes: user.recentRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's recent recipes
export const getRecentRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('recentRecipes');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.recentRecipes || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin-only: Search users by username or email
export const searchUsers = async (req, res) => {
  try {
    const { searchTerm, searchType } = req.query;

    if (!searchTerm) {
      // Return all users if no search term
      const users = await User.find({}, 'username email role createdAt').sort({ createdAt: -1 });
      return res.status(200).json(users);
    }

    let query = {};

    if (searchType === 'email') {
      query.email = { $regex: searchTerm, $options: 'i' };
    } else {
      // Default to username search
      query.username = { $regex: searchTerm, $options: 'i' };
    }

    const users = await User.find(query, 'username email role createdAt').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
>>>>>>> Stashed changes
};