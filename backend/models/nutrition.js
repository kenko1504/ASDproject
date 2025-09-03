import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema({
  classification: { type: String, required: true },
  foodName: { type: String, required: true },
  nutrients: {
    calories: { type: Number, required: false },
    protein: { type: Number, required: false },
    fat: { type: Number, required: false },
    transFat: { type: Number, required: false },
    carbohydrates: { type: Number, required: false },
    sugar: { type: Number, required: false },
    dietaryFiber: { type: Number, required: false },
    cholesterol: { type: Number, required: false },
    sodium: { type: Number, required: false },
    calcium: { type: Number, required: false },
    iron: { type: Number, required: false },
    vitaminC: { type: Number, required: false }
  },
});

const Nutrition = mongoose.model("Nutrition", nutritionSchema);

export default Nutrition;
