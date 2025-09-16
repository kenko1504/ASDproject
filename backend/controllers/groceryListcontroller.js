import GroceryList from "../models/groceryList.js"
import User from "../models/user.js";

export const createList = async (req, res) => {
  try {
    const { UID } = req.params; // User ID from the URL
    const { name, date, note, status } = req.body;
    const list = new GroceryList({ name, date, note, status });
    await list.save(); // Save the new grocery list to the database
    console.log("Grocery List created:", list);
    
    const user = await User.findById(UID);
    user.groceryList.push(list._id); // Add the list ID to the user's groceryLists array
    await user.save();
    res.status(201).json(list);
  } catch (err) {
    if (err.code === 11000) { // Duplicate list name error
      return res.status(400).json({ error: "A grocery list with this name already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

// uses User ID to get all their grocery lists
export const getLists = async (req, res) => {
  try {
    const { UID } = req.params;
    const user = await User.findById(UID).populate("groceryList"); // Populate the groceryLists field with actual list documents
    res.status(200).json(user.groceryList || []); // Return all grocery lists for the user
    console.log("Grocery Lists fetched:", user.groceryList);
    console.log("uid:", user._id);
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

// // Update User
// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { username, email, password } = req.body;

//     const updateFields = {};

//     if (username) updateFields.username = username;
//     if (email) updateFields.email = email;
//     if (password) {
//       const hashed = await bcrypt.hash(password, 10);
//       updateFields.password = hashed;
//     }

//     const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
//       new: true,
//     });

//     res.status(200).json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };