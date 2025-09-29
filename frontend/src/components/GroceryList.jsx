import "../CSS/index.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function GroceryList() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "", date: "", note: "", status: "active"
    });
    const [lists, setLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({
        _id: "",
        name: "",
        date: "",
        note: "",
        status: "active"
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/GroceryLists/${user._id}`)
            .then(lists => setLists(lists.data))
            .catch(err => console.log(err))
    }, [user._id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const resetForm = () => {
        setForm({ name: "", date: "", note: "", status: "active" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/GroceryLists/${user._id}`, {
                name: form.name,
                date: form.date,
                note: form.note,
                status: form.status
            });
            resetForm();
            setLists(prevLists => [...prevLists, res.data]);
        } catch (err) {
            console.error(err.response?.data || err);
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
        setEditForm(list);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditForm({ _id: "", name: "", date: "", note: "", status: "active" });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/GroceryLists/${editForm._id}`, {
                name: editForm.name,
                date: editForm.date,
                note: editForm.note,
                status: editForm.status
            });
            // Finds the list that has the same id as the list being edited
            // List is updated otherwise it remains the same
            setLists(lists.map(list => list._id === editForm._id ? res.data : list));
            closeModal();
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };


    return (
        <div className="w-full h-screen flex items-center flex-col !px-3 !py-3">
            <h1 className="justify-self-center text-3xl font-bold text-gray-800">Grocery List</h1>
            <form onSubmit={handleSubmit} className="flex flex-row !m-6 !gap-2 border border-gray-700 rounded !p-6">
                <label className="font-semibold">Name:</label>
                <input name="name" type="text" placeholder="list name..." value={form.name} onChange={handleChange} className="border border-gray-300 rounded !px-2" required />
                <label className="font-semibold">Date:</label>
                <input name="date" type="date" onChange={handleChange} className="border border-gray-300 rounded !px-2" 
                    value={new Date().toISOString().slice(0, 10)} // Placeholder for today's date
                    min={new Date().toISOString().slice(0, 10)} // Prevent selecting previous days
                    required />
                <label className="font-semibold">Note:</label>
                <input name="note" type="text" placeholder="list note..." value={form.note} onChange={handleChange} className="border border-gray-300 rounded !px-2" />
                <button className="bg-blue-500 text-white rounded !px-4" type="submit">New List</button>
            </form>

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
                            <td className="!px-2 !py-1">{new Date(list.date).toLocaleDateString()}</td>
                            <td className={`!px-2 !py-1 font-semibold ${list.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{list.status}</td>
                            <td className="!px-2 !py-1">{list.note}</td>
                            <td className="!px-2 !py-1">
                                <button
                                    onClick={() => navigate(`view/${list._id}`)}
                                    className="bg-green-500 text-white !px-4 rounded !mr-2"
                                >View</button>
                                <button
                                    onClick={() => openEditModal(list, list._id)}
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

            {/* Editing Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white !p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold !mb-10 text-center">Edit Grocery List</h2>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                            <label className="flex justify-between items-center"><span className="font-semibold">Name:</span>
                                <input name="name" value={editForm.name} onChange={handleEditChange} className="border border-gray-300 !p-1 rounded" required />
                            </label>
                            <label className="flex justify-between items-center"><span className="font-semibold">Date:</span>
                                <input name="date" type="date" value={editForm.date.slice(0, 10)} onChange={handleEditChange} className="border border-gray-300 !p-1 rounded" required />
                            </label>
                            <label className="flex justify-between items-center"><span className="font-semibold">Note:</span>
                                <input name="note" value={editForm.note} onChange={handleEditChange} className="border border-gray-300 !p-1 rounded" />
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