// import mongoose from "mongoose";

// const GroceryListSchema = new mongoose.Schema ( {
//     name: String, 
//     date: Date,
//     note: String,
//     status: String
// })

// const GroceryListModel = mongoose.model('GroceryList', GroceryListSchema);
// export default GroceryListModel;

import mongoose from "mongoose";

const groceryListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    items: [ {type: mongoose.Schema.Types.ObjectId, ref: "Item"} ],
    status: { type: String, enum: ['active', 'completed'], default: 'completed' },
    date: { type: Date, default: Date.now },
    note: { type: String, default: '' },
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

export default GroceryList;
