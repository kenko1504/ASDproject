import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    userId: {type: String},
    date: { type: Date, default: Date.now },
    mealType: { type:String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
        },
    ]
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
