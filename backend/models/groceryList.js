import mongoose from "mongoose";

const groceryListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // items: [ {type: mongoose.Schema.Types.ObjectId, ref: "Item", default: [] }],
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    date: { type: Date, required: true },
    note: { type: String, default: '' },
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

export default GroceryList;
