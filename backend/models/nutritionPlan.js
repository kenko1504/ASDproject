import mongoose from "mongoose";

const nutritionPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal: { type: String, enum: ['weight_loss', 'muscle_gain', 'maintenance'],required: true },
    meals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meal",
        },
    ],
    startDate: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const NutritionPlan = mongoose.model("NutritionPlan", nutritionPlanSchema);

export default NutritionPlan;
