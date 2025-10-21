import mongoose from "mongoose";

const groceryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required']
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Meat', 'Vegetable', 'Fruit', 'Drink', 'Other']
    },
    groceryList: { // Reference to the GroceryList this item belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroceryList',
    },
    checked: { // For Grocery List - whether the item has been checked off
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true
});

const GroceryItem = mongoose.model("GroceryItem", groceryItemSchema);

export default GroceryItem;