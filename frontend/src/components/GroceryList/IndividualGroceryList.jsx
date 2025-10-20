// import "../CSS/index.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ViewGroceryItems() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState({ name: "", quantity: 0, category: "Other" });
    const [itemList, setItemList] = useState([]);
    const [groceryList, setGroceryList] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState({ _id: "", name: "", quantity: 0, category: "Other" });

    useEffect(() => {
        axios.get(`http://localhost:5000/GroceryLists/${id}/items`)
            .then(({ data }) => {
                const { items, groceryList } = data;
                setItemList(items);
                setGroceryList(groceryList);
            })
            .catch(err => console.log(err))
    }, [id]);

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const resetItem = () => {
        setItem({ name: "", quantity: 0, category: "Other" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/GroceryLists/${id}/items`, {
                name: item.name,
                quantity: item.quantity,
                category: item.category
            });
            resetItem();
            setItemList(prevLists => [...prevLists, res.data]);
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/GroceryLists/item/${itemId}`);
            setItemList(prevLists => prevLists.filter(item => item._id !== itemId));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleCheckToggle = async (item) => {
        const newCheckedState = !item.checked;
        // Update UI immediately
        setItemList(prev =>
            prev.map(i =>
                i._id === item._id ? { ...i, checked: newCheckedState } : i
            )
        );
        // Save to backend
        try {
            await axios.put(`http://localhost:5000/GroceryLists/item/${item._id}`, {
                name: item.name,
                quantity: item.quantity,
                category: item.category,
                checked: newCheckedState
            });
        } catch (error) {
            console.error("Error updating item:", error);
            // Revert UI change on error
            setItemList(prev =>
                prev.map(i =>
                    i._id === item._id ? { ...i, checked: !newCheckedState } : i
                )
            );
        }
    };

        // --- Modal logic ---
    const openEditModal = (item) => {
        setEditItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditItem({ _id: "", name: "", quantity: 0, category: "Other" });
    };

    const handleEditChange = (e) => {
        setEditItem({ ...editItem, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/GroceryLists/item/${editItem._id}`, {
                name: editItem.name,
                quantity: editItem.quantity,
                category: editItem.category
            });
            // Finds the list that has the same id as the list being edited
            // List is updated otherwise it remains the same
            setItemList(itemList.map(item => item._id === editItem._id ? res.data : item));
            closeModal();
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };

    return (
        <div className="w-full h-screen flex items-center flex-col !px-3 !py-3">
            <div className="flex items-center justify-between w-full max-w-4xl !mb-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 text-white !px-4 !py-2 rounded hover:bg-gray-600"
                >
                    ← Back
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{groceryList.name}</h1>
                <div className="w-20"></div> {/* Spacer for center alignment */}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-row !m-6 !gap-2 border border-gray-700 rounded !p-6">
                <label className="font-semibold">Name:</label>
                <input name="name" type="text" placeholder="item name..." value={item.name} onChange={handleChange} className="border border-gray-300 rounded !px-2" required />
                <label className="font-semibold">Quantity:</label>
                <input name="quantity" type="number" placeholder="quantity" value={item.quantity} onChange={handleChange} className="border border-gray-300 rounded !px-2" required min="1" />
                <label className="font-semibold">Category:</label>
                <select name="category" value={item.category} onChange={handleChange} className="border border-gray-300 rounded !px-2" required>
                    <option value="Meat">Meat</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Drink">Drink</option>
                    <option value="Other">Other</option>
                </select>
                <button className="bg-blue-500 text-white rounded !px-4" type="submit">Add Item</button>
            </form>
            <table className="min-w-full border border-gray-300 bg-white text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th>Checked</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((item) => (
                        <tr key={item._id} className={`border-gray-300 border-b hover:bg-gray-50 ${item.checked ? '!line-through opacity-60' : ''}`}>
                            <td className="!px-2 !py-1">
                                <input
                                    type="checkbox"
                                    checked={!!item.checked}
                                    onChange={() => handleCheckToggle(item)}
                                />
                            </td>
                            <td className="!px-2 !py-1">{item.name}</td>
                            <td className="!px-2 !py-1">{item.category}</td>
                            <td className="!px-2 !py-1">{item.quantity}</td>
                            <td className="!px-2 !py-1">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="!px-4 !mr-5 bg-blue-500 text-white rounded"
                                >Edit</button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="bg-red-500 text-white !px-4 rounded"
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Editing Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white !p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold !mb-10 text-center">Edit Item</h2>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                            <label className="flex justify-between items-center"><span className="font-semibold">Name:</span>
                                <input name="name" value={editItem.name} onChange={handleEditChange} className="border border-gray-300 !p-1 rounded" required />
                            </label>
                            <label className="flex justify-between items-center"><span className="font-semibold">Quantity:</span>
                                <input name="quantity" type="number" value={editItem.quantity} onChange={handleEditChange} className="border border-gray-300 !p-1 rounded" required />
                            </label>
                            <label className="flex justify-between items-center"><span className="font-semibold">Category:</span>
                                <input name="note" value={editItem.category} onChange={handleEditChange} className="border border-gray-300 !p-1 rounded" />
                            </label>
                            <div className="flex justify-end gap-2 !mt-2">
                                <button type="button" onClick={closeModal} className="bg-gray-300 !px-3 !py-1 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white !px-3 !py-1 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}