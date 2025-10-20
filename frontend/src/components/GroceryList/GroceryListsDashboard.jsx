import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AddGroceryList from "./AddGroceryList";
import EditGroceryList from "./EditGroceryList";
import { formatDate } from "../../utils/dateUtils";

export default function GroceryList() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [lists, setLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [addError, setAddError] = useState("");
    const [editError, setEditError] = useState("");
    const [selectedList, setSelectedList] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/GroceryLists/${user._id}`)
            .then(lists => setLists(lists.data))
            .catch(err => console.log(err))
    }, [user._id]);

    const handleAddSubmit = async (formData) => {
        setAddError(""); // Clear any previous errors
        try {
            const res = await axios.post(`http://localhost:5000/GroceryLists/${user._id}`, {
                name: formData.name,
                date: formData.date,
                note: formData.note,
                status: formData.status
            });
            setLists(prevLists => [...prevLists, res.data]);
            return true; // Success
        } catch (err) {
            console.error(err.response?.data || err);
            // Display the error message from the server
            if (err.response?.data?.error) {
                setAddError(err.response.data.error);
            } else {
                setAddError("An error occurred while creating the grocery list.");
            }
            return false; // Failure
        }
    };
    
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/GroceryLists/${id}`);
            setLists(prevLists => prevLists.filter(list => list._id !== id));
        }
        catch (err) {
            console.error(err);
        }
    };

    // --- Modal logic ---
    const openEditModal = (list) => {
        setSelectedList(list);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedList(null);
    };

    const handleEditUpdate = async (editFormData) => {
        setEditError(""); // Clear any previous errors
        try {
            const res = await axios.put(`http://localhost:5000/GroceryLists/${user._id}/list/${editFormData._id}`, {
                name: editFormData.name,
                date: editFormData.date,
                note: editFormData.note,
                status: editFormData.status
            });
            // Finds the list that has the same id as the list being edited
            // List is updated otherwise it remains the same
            setLists(lists.map(list => list._id === editFormData._id ? res.data : list));
            return true; // Success
        } catch (err) {
            console.error(err.response?.data || err);
            if (err.response?.data?.error) {
                setEditError(err.response.data.error);
            } else {
                setEditError("An error occurred while updating the grocery list.");
            }
            return false; // Failure
        }
    };


    return (
        <div className="w-full h-screen flex items-center flex-col !px-3 !py-3">
            <h1 className="justify-self-center text-3xl font-bold text-gray-800 !p-5">Grocery List</h1>
            
            <AddGroceryList onSubmit={handleAddSubmit} error={addError} />

            <table className="min-w-full border border-gray-300 bg-white text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Note</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {lists.map((list) => (
                        <tr key={list._id} className="border-gray-300 border-b hover:bg-gray-50">
                            <td className="!px-2 !py-1">{list.name}</td>
                            <td className="!px-2 !py-1">{formatDate(list.date)}</td>
                            <td className={`!px-2 !py-1 font-semibold ${list.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{list.status}</td>
                            <td className="!px-2 !py-1">{list.note}</td>
                            <td className="!px-2 !py-1">
                                <button
                                    onClick={() => navigate(`view/${list._id}`)}
                                    className="bg-green-500 text-white !px-4 rounded !mr-2"
                                >View</button>
                                <button
                                    onClick={() => openEditModal(list)}
                                    className="!px-4 !mr-5 bg-blue-500 text-white rounded"
                                >Edit</button>
                                <button
                                    onClick={() => handleDelete(list._id)}
                                    className="bg-red-500 text-white !px-4 rounded"
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <EditGroceryList
                isOpen={showModal}
                onClose={closeModal}
                list={selectedList}
                onUpdate={handleEditUpdate}
                error={editError}
            />
        </div>
    );
}