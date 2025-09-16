import "../CSS/index.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function GroceryList() {
    const { user } = useContext(AuthContext);
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
            setLists(lists.map(list => list._id === editForm._id ? res.data : list));
            closeModal();
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

    return (
        <div className="w-full h-screen flex items-center flex-col bg-red-50 !px-3 !py-3 rounded-2xl shadow-md">
            <h1 className="justify-self-center text-3xl font-bold text-gray-800">Grocery List</h1>
            <form onSubmit={handleSubmit} className="flex flex-row !mb-3 !gap-2">
                <label htmlFor="name">Name:</label>
                <input name="name" type="text" placeholder="list name..." value={form.name} onChange={handleChange} required />
                <label htmlFor="date">Date:</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
                <label htmlFor="note">Note:</label>
                <input name="note" type="text" placeholder="list note..." value={form.note} onChange={handleChange} required />
                <button type="submit">Add Item</button>
            </form>

            <table className="min-w-full border border-gray-300 bg-white">
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
                        <tr key={list._id}>
                            <td className="!px-2 !py-1 border-b">{list.name}</td>
                            <td className="!px-2 !py-1 border-b">{new Date(list.date).toLocaleDateString()}</td>
                            <td className="!px-2 !py-1 border-b">{list.status}</td>
                            <td className="!px-2 !py-1 border-b">{list.note}</td>
                            <td className="!px-2 !py-1 border-b">
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Grocery List</h2>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                            <label>Name:</label>
                            <input name="name" value={editForm.name} onChange={handleEditChange} required />
                            <label>Date:</label>
                            <input name="date" type="date" value={editForm.date.slice(0, 10)} onChange={handleEditChange} required />
                            <label>Note:</label>
                            <input name="note" value={editForm.note} onChange={handleEditChange} />
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={closeModal} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}