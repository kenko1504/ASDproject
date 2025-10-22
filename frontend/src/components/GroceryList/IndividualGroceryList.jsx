// import "../CSS/index.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AddGroceryItem from "./AddGroceryItem";
import EditGroceryItem from "./EditGroceryItem";
import CopyGroceryList from "./CopyGroceryList";
import services from "./groceryServices";

export default function ViewGroceryItems() {
    const { gid, status } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [itemList, setItemList] = useState([]);
    const [groceryList, setGroceryList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [editItem, setEditItem] = useState({ _id: "", name: "", quantity: 0, category: "Other" });
    const [addError, setAddError] = useState("");
    const [editError, setEditError] = useState("");
    const [copyError, setCopyError] = useState("");

    useEffect(() => {
        services.getItem(user._id, gid, localStorage.getItem("token"))
            .then((data) => {
                const { items, groceryList } = data;
                setItemList(items);
                setGroceryList(groceryList);
            })
            .catch(err => console.log(err))
    }, [user._id, gid]);

    const handleAddSubmit = async (item) => {
        setAddError(""); // Clear any previous errors
        try {
            const res = await services.createItem(user._id, gid, {
                name: item.name,
                quantity: item.quantity,
                category: item.category
            }, localStorage.getItem("token"));
            setItemList(prevLists => [...prevLists, res]);
            return true; 
        } catch (err) {
            console.error(err.response?.data || err);
            // Display the error message from the server
            if (err.response?.data?.error) {
                setAddError(err.response.data.error);
            } else {
                setAddError("An error occurred while adding the item.");
            }
            return false; 
        }
    };

    const handleDelete = async (itemID) => {
        try {
            await services.deleteItem(user._id, gid, itemID, localStorage.getItem("token"));
            setItemList(prevLists => prevLists.filter(item => item._id !== itemID));
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
            await services.updateItem(user._id, gid, item._id, {
                name: item.name,
                quantity: item.quantity,
                category: item.category,
                checked: newCheckedState
            }, localStorage.getItem("token"));
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

    const handleEditUpdate = async (item) => {
        setEditError(""); // Clear any previous errors
        try {
            const res = await services.updateItem(user._id, gid, item._id, {
                name: item.name,
                quantity: item.quantity,
                category: item.category
            }, localStorage.getItem("token"));
            // Finds the item that has the same id as the item being edited
            // Item is updated otherwise it remains the same
            setItemList(itemList.map(listItem => listItem._id === item._id ? res : listItem));
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

    // Copy list functionality
    const handleCopyList = async (newList) => {
        setCopyError(""); // Clear any previous errors
        try {
            const res = await services.copyList(user._id, gid, newList, localStorage.getItem("token"));
            // Navigate to the main grocery list page to see the new copied list
            navigate('/grocery-list');
            return true; // Success
        } catch (err) {
            console.error(err.response?.data || err);
            // Display the error message from the server
            if (err.response?.data?.error) {
                setCopyError(err.response.data.error);
            } else {
                setCopyError("An error occurred while copying the grocery list.");
            }
            return false; // Failure
        }
    };

    const handleCloseList = async () => {
        if (!confirm("Are you sure you want to close this grocery list?")) {
            return;
        }
        try {
            await services.updateList(user._id, gid, { status: "completed" }, localStorage.getItem("token"));
            navigate('/grocery-list');
        } catch (error) {
            console.error("Error updating list status:", error);
        }
    };

    const openCopyModal = () => {
        setShowCopyModal(true);
    };

    const closeCopyModal = () => {
        setShowCopyModal(false);
        setCopyError("");
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
                <h1 className="text-3xl font-bold text-gray-800 !pt-5">{groceryList.name}</h1>
                {status !== "completed" ? <div  className="flex space-x-3">
                    <button 
                        onClick={openCopyModal}
                        className="bg-green-500 text-white !px-4 !py-2 !mr-3 rounded hover:bg-green-600"
                    >
                        Copy List
                    </button>
                    <button 
                        onClick={handleCloseList}
                        className="bg-red-500 text-white !px-4 !py-2 rounded hover:bg-red-600"
                    >
                        Close List
                    </button>
                </div> : <div></div>}
            </div>
            { status !== "completed" ? <AddGroceryItem onSubmit={handleAddSubmit} error={addError} /> 
            : <div className="text-red-500">Completed</div>}

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

            <CopyGroceryList
                isOpen={showCopyModal}
                onClose={closeCopyModal}
                onCopy={handleCopyList}
                error={copyError}
                currentListName={groceryList.name}
            />
        </div>
    );
}