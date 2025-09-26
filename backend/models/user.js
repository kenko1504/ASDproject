import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    password: { type: String, required: true },
    fridgeList: { type: mongoose.Schema.Types.ObjectId, ref: 'Fridge' },
    groceryList: { type: mongoose.Schema.Types.ObjectId, ref: 'Grocery' },
    nutritionPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'NutritionPlan' },
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
<<<<<<< Updated upstream
=======
    recentRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    characteristics: {
        gender: { type: String, enum: ['Male', 'Female']},
        age: { type: Number },
        weight: { type: Number },
        height: { type: Number },
    },
>>>>>>> Stashed changes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
