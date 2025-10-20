// import "../CSS/index.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AddGroceryItem from "./AddGroceryItem";
import EditGroceryItem from "./EditGroceryItem";

export default function ViewGroceryItems() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [itemList, setItemList] = useState([]);
    const [groceryList, setGroceryList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState({ _id: "", name: "", quantity: 0, category: "Other" });
    const [addError, setAddError] = useState("");
    const [editError, setEditError] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/GroceryLists/${id}/items`)
            .then(({ data }) => {
                const { items, groceryList } = data;
                setItemList(items);
                setGroceryList(groceryList);
            })
            .catch(err => console.log(err))
    }, [id]);

    const handleAddSubmit = async (itemData) => {
        setAddError(""); // Clear any previous errors
        try {
            const res = await axios.post(`http://localhost:5000/GroceryLists/${id}/items`, {
                name: itemData.name,
                quantity: itemData.quantity,
                category: itemData.category
            });
            setItemList(prevLists => [...prevLists, res.data]);
            return true; // Success
        } catch (err) {
            console.error(err.response?.data || err);
            // Display the error message from the server
            if (err.response?.data?.error) {
                setAddError(err.response.data.error);
            } else {
                setAddError("An error occurred while adding the item.");
            }
            return false; // Failure
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

    const handleEditUpdate = async (editItemData) => {
        setEditError(""); // Clear any previous errors
        try {
            const res = await axios.put(`http://localhost:5000/GroceryLists/item/${editItemData._id}`, {
                name: editItemData.name,
                quantity: editItemData.quantity,
                category: editItemData.category
            });
            // Finds the item that has the same id as the item being edited
            // Item is updated otherwise it remains the same
            setItemList(itemList.map(item => item._id === editItemData._id ? res.data : item));
            return true; // Success
        } catch (err) {
            console.error(err.response?.data || err);
            if (err.response?.data?.error) {
                setEditError(err.response.data.error);
            } else {
                setEditError("An error occurred while updating the item.");
            }
            return false; // Failure
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

            <AddGroceryItem onSubmit={handleAddSubmit} error={addError} />

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

            {showModal && (
                <EditGroceryItem
                    isOpen={showModal}
                    onClose={closeModal}
                    item={editItem}
                    onUpdate={handleEditUpdate}
                    error={editError}
                />
            )}
        </div>
    );
}