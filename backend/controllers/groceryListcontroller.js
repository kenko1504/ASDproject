import GroceryList from "../models/groceryList.js"

export const createList = async (req, res) => {
  try {
    const { name, date, note, status } = req.body;
    const list = new GroceryList({ name, date, note, status });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({ error: "A grocery list with this name already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getLists = async (req, res) => {
  try {
    const lists = await GroceryList.find();
    res.json(lists);
    console.log("Grocery Lists fetched:", lists);
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