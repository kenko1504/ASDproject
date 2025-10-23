import Ingredient from "../models/ingredient.js";


export const createIngredient = async (req, res) => {
  try {
    const { name, quantity, price, category, expiryDate, description, inFridge } = req.body;

    if (!name || !quantity || !price || !category || !expiryDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // multer stores file info in req.file
    const image = req.file ? req.file.filename : null;

    const ingredient = new Ingredient({
      name: String(name).trim(),
      quantity: Number(quantity),
      price: Number(price),
      category,
      expiryDate,
      description,
      inFridge,
      image,
      userId: req.user._id // associate ingredient with logged-in user
    });

    await ingredient.save();
    return res.json({
      ...ingredient.toObject(),
      imageUrl: image ? `/imageUploads/${image}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({userId: req.user._id});

    // map image filename to full URL
    const ingredientsWithUrl = ingredients.map(ing => ({
       // ...ing._doc,
      ...ing.toObject(),
      imageUrl: ing.image ? `/imageUploads/${ing.image}` : null
    }));
    console.log(ingredientsWithUrl);
    return res.json(ingredientsWithUrl);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Read one by id
export const getIngredientById = async (req, res) => {
  try {
    const ing = await Ingredient.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!ing) return res.status(404).json({ error: "Ingredient not found" });

    res.json({
      ...ing.toObject(),
      imageUrl: ing.image ? `/imageUploads/${ing.image}` : null
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update
export const updateIngredient = async (req, res) => {
  try {
    const update = {
      ...req.body
    };

    //if a new image is uploaded, replace the image by the new one
    if (req.file) update.image = req.file.filename;

    if (update.quantity !== undefined) update.quantity = Number(update.quantity);
    if (update.price !== undefined) update.price = Number(update.price);

    const updated = await Ingredient.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        update,
        { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Ingredient not found" });

    res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete
export const deleteIngredient = async (req, res) => {
  try {
    const deleted = await Ingredient.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!deleted) return res.status(404).json({ error: "Ingredient not found" });

    res.json({ message: "Ingredient deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};