import mongoose from "mongoose";

const Ingredient = mongoose.model("Ingredient", new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required']
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price can not be negative']
  },
  category: {
    type: String,
    required: true,
    enum: ['Meat', 'Vegetable', 'Fruit', 'Drink', 'Other']
  },
  expiryDate: {
    type: Date,
    required: true
  },
  description:{
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  inFridge: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
}));

export default Ingredient;