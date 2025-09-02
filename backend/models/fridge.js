import mongoose from "mongoose";

const fridgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

const Fridge = mongoose.model("Fridge", fridgeSchema);

export default Fridge;
