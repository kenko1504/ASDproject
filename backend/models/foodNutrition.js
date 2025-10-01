import mongoose from "mongoose";

const foodNutritionSchema = new mongoose.Schema({
  Public_Food_Key: { type: String, required: false },
  foodName: { type: String, required: true },
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
  vitaminC: { type: Number, required: false },
  energy: { type: Number, required: false },
  type: { type: String, required: false }
});

// Virtual field to calculate calories from energy
foodNutritionSchema.virtual('calories').get(function() {
  // Convert energy (kJ) to calories (kcal)
  // Standard conversion: 1 kcal = 4.184 kJ
  if (this.energy) {
    return Math.round(this.energy / 4.184);
  }
  return null;
});

// Ensure virtual fields are included in JSON output
foodNutritionSchema.set('toJSON', { virtuals: true });
foodNutritionSchema.set('toObject', { virtuals: true });

const FoodNutrition = mongoose.model("FoodNutrition", foodNutritionSchema);

export default FoodNutrition;
