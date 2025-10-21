import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import groceryRoutes from "./routes/groceryRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import mealRoutes from "./routes/mealRoutes.js"

import recommendRoutes from "./routes/recommendRoutes.js";
import receiptUploadRoutes from "./routes/receiptUploadRoutes.js";
import Food from "./models/food.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // read .env
const app = express();

// CORS configuration - restrict origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
//routes
app.use("/items", itemRoutes)
app.use("/auth", authRoutes);
app.use("/ingredients", ingredientRoutes);
app.use("/users", userRoutes);
app.use("/GroceryLists", groceryRoutes);
app.use("/recipes", recipeRoutes);
app.use("/receipt", receiptUploadRoutes);
app.use("/nutrition", nutritionRoutes)
app.use("/meal", mealRoutes)
app.use("/recommendations", recommendRoutes);

//connect with MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { //it will go to .env directory to find MONGO_URI for connecting with MongoDB Atlas
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.error("MongoDB connection error: ", err));

// Serve images from the folder
app.use("/imageUploads", express.static(path.join(__dirname, "imageUploads")));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Anything that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (!req.path.startsWith('/items') &&
        !req.path.startsWith('/auth') &&
        !req.path.startsWith('/ingredients') &&
        !req.path.startsWith('/users') &&
        !req.path.startsWith('/GroceryLists') &&
        !req.path.startsWith('/recipes') &&
        !req.path.startsWith('/receipt') &&
        !req.path.startsWith('/nutrition') &&
        !req.path.startsWith('/meal') &&
        !req.path.startsWith('/recommendations') &&
        !req.path.startsWith('/Food') &&
        !req.path.startsWith('/imageUploads')) {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
  });
}

// Example data
let items = [
  { id: 1, name: "Banana", price: 10 },
  { id: 2, name: "Apple", price: 20 },
];

app.get("/Food", (req, res) => {
  Food.find()
    .then(items => res.json(items))
    .catch(err => res.json(err));
  console.log("Food Get");
});


// Start server - use Azure's PORT environment variable or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

//mongodb+srv://admin:1q2w3e4r!@cluster0.exeo5q3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0