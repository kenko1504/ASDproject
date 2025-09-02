import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js";


dotenv.config(); // read .env
const app = express();
app.use(cors());
app.use(express.json());
//routes
app.use("/items", itemRoutes)

//connect with MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { //it will go to .env directory to find MONGO_URI for connecting with MongoDB Atlas
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.error("MongoDB connection error: ", err));


const Ingredient = mongoose.model("Ingredient", new mongoose.Schema({
  name: String,
  quantity: Number,
  expiryDate: String,
  description: String,
  image: String
}));

app.post("/ingredients", async (req, res) => {
  const { name, quantity, expiryDate, description, image } = req.body;
  const ingredient = new Ingredient({ name, quantity, expiryDate, description, image });
  await ingredient.save();
  res.json(ingredient);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

//mongodb+srv://admin:1q2w3e4r!@cluster0.exeo5q3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0