import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required']
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
    imgUrl: {
        type: String,
        default: ''
    },
    description:{ // description of item
        type: String,
        default: ''
    },
    nutritionValue:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutrition'
    }
}, {
    timestamps: true
});

const Item = mongoose.model("Item", itemSchema);

export default Item;