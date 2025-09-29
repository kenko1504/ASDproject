import mongoose from "mongoose";

const ingredient = mongoose.model("Ingredient", new mongoose.Schema({
  name: String,
  quantity: Number,
  expiryDate: String,
  description: String,
  image: String,
  inFridge: Boolean
}));

export default ingredient;