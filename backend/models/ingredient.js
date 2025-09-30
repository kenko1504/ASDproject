import mongoose from "mongoose";

const ingredient = mongoose.model("Ingredient", new mongoose.Schema({
  name: String,
  quantity: Number,
  expiryDate: String,
  description: String,
  image: String,
  inFridge: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}));

export default ingredient;