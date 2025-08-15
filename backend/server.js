import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Example data
let items = [
  { id: 1, name: "Item A", price: 10 },
  { id: 2, name: "Item B", price: 20 },
];

// GET all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// GET single item by id
app.get("/api/items/:id", (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));