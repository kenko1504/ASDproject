import GroceryList from "../models/groceryList.js"
import User from "../models/user.js";
import GroceryItem from "../models/item.js";

export const createList = async (req, res) => {
  try {
    const { UID } = req.params; // User ID from the URL
    const user = await User.findById(UID);
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // User error handling
    }
    const { name, date, note, status } = req.body;
    const existingList = await GroceryList.findOne({ name, user: UID });
    if (existingList) {
      return res.status(400).json({ error: "A grocery list with this name already exists." });
    }
    const list = new GroceryList({ name, user: UID, date, note, status });
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
    const { UID } = req.params;
    // const user = await User.findById(UID).populate("groceryList"); // Populate the groceryLists field with actual list documents
    const lists = await GroceryList.find({ user: UID }); // Find all grocery lists for the user
    if (!lists) {
      return res.status(404).json({ error: "No grocery lists found for this user." });
    }
    res.status(200).json(lists);
    console.log("Grocery Lists fetched:", lists);
    console.log("uid:", UID);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

// Delete grocery list from user
export const deleteList = async (req, res) => {
  try {
    const { GL_ID } = req.params; // Grocery List ID from the URL
    
    await GroceryList.findByIdAndDelete(GL_ID); // Delete the grocery list from the database

    res.status(200).json({ message: "Grocery list deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateList = async (req, res) => {
  try {
    const { GL_ID } = req.params; // Grocery List ID from the URL
    const { name, date, note, status } = req.body;
    const updatedList = await GroceryList.findByIdAndUpdate(
      GL_ID,
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
    const { GL_ID } = req.params; // Grocery List ID from the URL
    const list = await GroceryList.findById(GL_ID);
    if (!list) {
      return res.status(404).json({ error: "Grocery list not found" }); // Grocery list error handling
    }
    const { name, quantity, category } = req.body;
    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative." });
    }
    const item = new GroceryItem({ name, quantity, category, groceryList: GL_ID, expiryDate: new Date(), price: 0 });
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
    const { GL_ID } = req.params;
    const groceryList = await GroceryList.findById(GL_ID);
    if (!groceryList) {
      return res.status(404).json({ error: "Grocery list not found" }); // Grocery list error handling
    }
    // const user = await User.findById(UID).populate("groceryList"); // Populate the groceryLists field with actual list documents
    const items = await GroceryItem.find({ groceryList: GL_ID }); // Find all grocery items for the user
    if (!items) {
      return res.status(404).json({ error: "No grocery items found for this user." });
    }
    res.status(200).json({ items, groceryList });
    console.log("Grocery Items fetched:", items);
    console.log("GL_ID:", GL_ID);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};


export const updateItem = async (req, res) => {
  try {
    const { ITEM_ID } = req.params; // Grocery Item ID from the URL
    const { name, quantity, category, checked } = req.body;
    const updatedItem = await GroceryItem.findByIdAndUpdate(
      ITEM_ID,
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
    const { ITEM_ID } = req.params; // Grocery Item ID from the URL

    await GroceryItem.findByIdAndDelete(ITEM_ID); // Delete the grocery item from the database

    res.status(200).json({ message: "Grocery item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};