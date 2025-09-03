import mongoose from "mongoose";

const groceryListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
        },
    ],
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    note: { type: String, default: '' },
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

export default GroceryList;
