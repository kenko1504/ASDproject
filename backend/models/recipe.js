import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cookTime: { type: Number, required: true},
    difficulty: { type: String, required: true},
    date: { type: Date, default: Date.now },
    ingredientNo: { type: Number, required: true},
    ingredients: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Ingredient",
        },
    ],
    instructions: { type: [mongoose.Schema.Types.ObjectId], ref: "Step", required: true },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
