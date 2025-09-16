import mongoose from "mongoose";

const groceryListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [ {type: mongoose.Schema.Types.ObjectId, ref: "Item", default: [] }],
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    date: { type: Date, required: true },
    note: { type: String, default: '' },
});

groceryListSchema.set('strictPopulate', false);
const GroceryList = mongoose.model("GroceryList", groceryListSchema);

export default GroceryList;
