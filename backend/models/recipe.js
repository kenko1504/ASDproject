import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cookTime: { type: Number, required: true}, // in minutes
    difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard']},
    date: { type: Date, default: Date.now },
    ingredientNo: { type: Number, required: true},
    description: { type: String, required: true},
    image: { type: String, required: true},
    ingredients: [
        {
            ingredient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            measurementType: {
                type: String,
                required: true,
                enum: ['grams', 'ml']
            }
        }
    ],
    instructions: [{ 
        type: String, 
        required: true 
    }],
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
