import GroceryList from "../models/groceryList.js"
import User from "../models/user.js";

export const createList = async (req, res) => {
  try {
    const { UID } = req.params;
    const { name, date, note, status } = req.body;
    const list = new GroceryList({ name, date, note, status, userId: UID });
    await list.save(); // Save the new grocery list to the database
    console.log("Grocery List created:", list);
    
    await User.findByIdAndUpdate(UID, { $push: { groceryLists: list._id } }); // Add the list ID to the user's groceryLists array

    res.status(201).json(list);


  } catch (err) {
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({ error: "A grocery list with this name already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

// uses User ID to get all their grocery lists
export const getLists = async (req, res) => {
  try {
    const { UID } = req.params;
    const user = await User.findById(UID).populate("groceryLists"); // Populate the groceryLists field with actual list documents
    res.status(200).json(user.groceryLists); // Return all grocery lists for the user
    console.log("Grocery Lists fetched:", user.groceryLists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Delete User
// export const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
    
//     await User.findByIdAndDelete(userId);
    
//     res.status(200).json({ message: "Account deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

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