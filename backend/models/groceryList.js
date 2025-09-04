import mongoose from "mongoose";

const GroceryListSchema = new mongoose.Schema ( {
    name: String, 
    date: Date,
    note: String,
    status: String
})

const GroceryListModel = mongoose.model('GroceryList', GroceryListSchema);
export default GroceryListModel;