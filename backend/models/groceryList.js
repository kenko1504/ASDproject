import mongoose from "mongoose";

const groceryListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
        },
    ],
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    date: { type: Date, default: Date.now },
    note: { type: String, default: '' },
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

export default GroceryList;
