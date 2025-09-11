import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import GroceryListModel from "./models/groceryList.js";
import Food from "./models/food.js";


dotenv.config(); // read .env
const app = express();
app.use(cors());
app.use(express.json());
//routes
app.use("/items", itemRoutes)
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

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

// Example data
let items = [
  { id: 1, name: "Banana", price: 10 },
  { id: 2, name: "Apple", price: 20 },
];

// GET all ingredients
app.get("/ingredients", (req, res) => {
  res.json(items);
});

app.post("/GroceryLists", async (req, res) => {
  const { name, date, note, status } = req.body;
  const groceryList = new GroceryListModel({ name, date, note, status });
  await  groceryList.save();
  res.json( groceryList);
  console.log("Grocery List saved:",  groceryList);
});

app.get("/GroceryLists", (req, res) => {
  GroceryListModel.find()
    .then(lists => res.json(lists))
    .catch(err => res.json(err));
  console.log("Grocery List Get");
})

app.get("/Food", (req, res) => {
  Food.find()
    .then(items => res.json(items))
    .catch(err => res.json(err));
  console.log("Food Get");
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

//mongodb+srv://admin:1q2w3e4r!@cluster0.exeo5q3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0