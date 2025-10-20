import GroceryList from "../models/groceryList.js"
import User from "../models/user.js";
import GroceryItem from "../models/groceryItem.js";

export const createList = async (req, res) => {
  try {
    const { uid } = req.params; // User ID from the URL
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // User error handling
    }
    const { name, date, note, status } = req.body;
    const existingList = await GroceryList.findOne({ name, user: uid });
    if (existingList) {
      return res.status(400).json({ error: "A grocery list with this name already exists." });
    }
    const list = new GroceryList({ name, user: uid, date, note, status });
    await list.save(); // Save the new grocery list to the database
    console.log("Grocery List created:", list);
    
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// uses User ID to get all their grocery lists
export const getLists = async (req, res) => {
  try {
    const { uid } = req.params;
    // const user = await User.findById(uid).populate("groceryList"); // Populate the groceryLists field with actual list documents
    const lists = await GroceryList.find({ user: uid }); // Find all grocery lists for the user
    if (!lists) {
      return res.status(404).json({ error: "No grocery lists found for this user." });
    }
    res.status(200).json(lists);
    console.log("Grocery Lists fetched:", lists);
    console.log("uid:", uid);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

// Delete grocery list from user
export const deleteList = async (req, res) => {
  try {
    const { id } = req.params; // Grocery List ID from the URL
    
    await GroceryList.findByIdAndDelete(id); // Delete the grocery list from the database

    res.status(200).json({ message: "Grocery list deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateList = async (req, res) => {
  try {
    const { id } = req.params; // Grocery List ID from the URL
    const { name, date, note, status } = req.body;
    const updatedList = await GroceryList.findByIdAndUpdate(
      id,
      { name, date, note, status },
      { new: true } // Return the updated document
    );
    res.status(200).json(updatedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const createItem = async (req, res) => {
  try {
    const { id } = req.params; // Grocery List ID from the URL
    const list = await GroceryList.findById(id);
    if (!list) {
      return res.status(404).json({ error: "Grocery list not found" }); // Grocery list error handling
    }
    const { name, quantity, category } = req.body;
    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative." });
    }
    const item = new GroceryItem({ name, quantity, category, groceryList: id });
    await item.save(); // Save the new grocery item to the database
    console.log("Grocery Item created:", item);
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000) { // Duplicate item name error
      return res.status(400).json({ error: "A grocery item with this name already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

// uses User ID to get all their grocery items
export const getItems = async (req, res) => {
  try {
    const { id } = req.params;
    const groceryList = await GroceryList.findById(id);
    if (!groceryList) {
      return res.status(404).json({ error: "Grocery list not found" }); // Grocery list error handling
    }
    // const user = await User.findById(uid).populate("groceryList"); // Populate the groceryLists field with actual list documents
    const items = await GroceryItem.find({ groceryList: id }); // Find all grocery items for the user
    if (!items) {
      return res.status(404).json({ error: "No grocery items found for this user." });
    }
    res.status(200).json({ items, groceryList });
    console.log("Grocery Items fetched:", items);
    console.log("id:", id);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};


export const updateItem = async (req, res) => {
  try {
    const { id } = req.params; // Grocery Item ID from the URL
    const { name, quantity, category, checked } = req.body;
    const updatedItem = await GroceryItem.findByIdAndUpdate(
      id,
      { name, quantity, category, checked },
      { new: true } // Return the updated document
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete grocery list from user
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params; // Grocery Item ID from the URL

    await GroceryItem.findByIdAndDelete(id); // Delete the grocery item from the database

    res.status(200).json({ message: "Grocery item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};