import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    userId: {type: String},
    date: { type: Date, default: Date.now },
    mealType: { type:String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    items: [
        {
            ingredient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
            },
            quantity: Number,
            measurementType: String
        },
    ]
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
