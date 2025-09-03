import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
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
