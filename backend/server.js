import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ingredients", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const { name, price } = req.body; // Get new values from request body
  if (name) item.name = name;
  if (price) item.price = price;

  res.json({ message: "Item updated", item });
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



// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));