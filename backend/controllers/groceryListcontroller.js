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
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

// Delete grocery list from user
export const deleteList = async (req, res) => {
  try {
    const { uid, gid } = req.params; // User ID and Grocery List ID from the URL
    
    // Verify the list belongs to the user before deleting
    const deletedList = await GroceryList.findOneAndDelete({ _id: gid, user: uid });
    
    if (!deletedList) {
      return res.status(404).json({ error: "Grocery list not found or doesn't belong to this user" });
    }

    res.status(200).json({ message: "Grocery list deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateList = async (req, res) => {
  try {
    const { gid, uid } = req.params; // Grocery List ID and User ID from the URL
    const { name, date, note, status } = req.body;
    
    // Verify the list belongs to the user
    const list = await GroceryList.findOne({ _id: gid, user: uid });
    if (!list) {
      return res.status(404).json({ error: "Grocery list not found or doesn't belong to this user" });
    }
    
    // Check for duplicate names (excluding current list)
    const existingList = await GroceryList.findOne({ name, user: uid, _id: { $ne: gid } });
    if (existingList) {
      return res.status(400).json({ error: "A grocery list with this name already exists." });
    }
    
    const updatedList = await GroceryList.findByIdAndUpdate(
      gid,
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
    const { uid, gid } = req.params; // User ID and Grocery List ID from the URL
    
    // Verify the list exists and belongs to the user
    const list = await GroceryList.findOne({ _id: gid, user: uid });
    if (!list) {
      return res.status(404).json({ error: "Grocery list not found or doesn't belong to this user" });
    }
    
    const { name, quantity, category } = req.body;
    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative." });
    }
    const item = new GroceryItem({ name, quantity, category, groceryList: gid });
    await item.save(); // Save the new grocery item to the database
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
    const { uid, gid } = req.params;
    
    // Verify the list exists and belongs to the user
    const groceryList = await GroceryList.findOne({ _id: gid, user: uid });
    if (!groceryList) {
      return res.status(404).json({ error: "Grocery list not found or doesn't belong to this user" });
    }
    
    const items = await GroceryItem.find({ groceryList: gid }); // Find all grocery items for the list
    res.status(200).json({ items, groceryList });
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};


export const updateItem = async (req, res) => {
  try {
    const { uid, gid, itemID } = req.params; // User ID, Grocery List ID, and Item ID from the URL
    
    // Verify the list belongs to the user
    const groceryList = await GroceryList.findOne({ _id: gid, user: uid });
    if (!groceryList) {
      return res.status(404).json({ error: "Grocery list not found or doesn't belong to this user" });
    }
    
    // Verify the item belongs to the list
    const existingItem = await GroceryItem.findOne({ _id: itemID, groceryList: gid });
    if (!existingItem) {
      return res.status(404).json({ error: "Item not found in this grocery list" });
    }
    
    const { name, quantity, category, checked } = req.body;
    const updatedItem = await GroceryItem.findByIdAndUpdate(
      itemID,
      { name, quantity, category, checked },
      { new: true } // Return the updated document
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete grocery item from user
export const deleteItem = async (req, res) => {
  try {
    const { uid, gid, itemID } = req.params; // User ID, Grocery List ID, and Item ID from the URL

    // Verify the list belongs to the user
    const groceryList = await GroceryList.findOne({ _id: gid, user: uid });
    if (!groceryList) {
      return res.status(404).json({ error: "Grocery list not found or doesn't belong to this user" });
    }

    // Delete the item only if it belongs to the specified list
    const deletedItem = await GroceryItem.findOneAndDelete({ _id: itemID, groceryList: gid });
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found in this grocery list" });
    }

    res.status(200).json({ message: "Grocery item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};