import Ingredient from "../models/ingredient.js";


export const createIngredient = async (req, res) => {
  try {
    const { name, quantity, expiryDate, description, inFridge } = req.body;

    // multer stores file info in req.file
    const image = req.file ? req.file.filename : null;

    const ingredient = new Ingredient({
      name,
      quantity,
      expiryDate,
      description,
      inFridge,
      image,
    });

    await ingredient.save();
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();

    // map image filename to full URL
    const ingredientsWithUrl = ingredients.map(ing => ({
      ...ing._doc,
      imageUrl: ing.image ? `http://localhost:5000/imageUploads/${ing.image}` : null
    }));
    console.log(ingredientsWithUrl);
    res.json(ingredientsWithUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};