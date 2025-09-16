import "../CSS/index.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GroceryList() {
    const [form, setForm] = useState({
        name: "", 
        date: "", 
        note: "", 
        status: "active"
    });
    const [lists, setLists] = useState([])

    useEffect(() => { // Populates list when webpage loads
        axios.get('http://localhost:5000/GroceryLists')
            .then(lists => setLists(lists.data))
            .catch(err => console.log(err))
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
    setForm({ name: "", date: "", note: "", status: "active" });    
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/GroceryLists", {
                name: form.name,
                date: form.date,
                note: form.note,
                status: form.status
            });
            console.log(res.data.message);
            resetForm();
            setLists(prevLists => [...prevLists, res.data]); // Append the new list to the existing lists
        } catch (err) {
            console.error(err);
        }
    }

    
    return (
        <div className="w-full h-screen flex items-center flex-col bg-red-50 !px-3 !py-3 rounded-2xl shadow-md">
            <h1 className="justify-self-center text-3xl font-bold text-gray-800">Grocery List</h1>
            <form onSubmit={handleSubmit} className="flex flex-row !mb-3 !gap-2">
                <label for="name">Name:</label>
                <input  name="name" type="text" placeholder="list name..." value={form.name} onChange={handleChange} required />
                <label for="date">Date:</label>
                <input name="date" type="date" placeholder="" value={form.date} onChange={handleChange} required />
                <label for="note">Note:</label>
                <input  name="note" type="text" placeholder="list name..." value={form.note} onChange={handleChange} required />
                <button type="submit">Add Item</button>
            </form>
            <div className="grid grid-cols-[5fr_1fr_1fr] w-full !mb-3">
                <div className="bg-white !px-1 !py-1">
                    <label>
                        Search:
                        <input type="text" className="ml-2 p-1 border border-gray-300 rounded" placeholder="Search items..." />
                    </label>
                    <button className="justify-self-start !px-3 !py-1 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">Search</button>
                </div>
                <div className="bg-blue-100">Filter</div>
                <div className="bg-green-100">Sort Date Desc</div>
            </div>

            <table className="min-w-full border border-gray-300 bg-white">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Action</th>
                </tr>
                </thead>
                <tbody>
                    {
                        lists.map((list) => (
                            <tr>
                                <td className="!px-2 !py-1 border-b">{list.name}</td>
                                <td className="!px-2 !py-1 border-b">{list.date}</td>
                                <td className="!px-2!py-1 border-b">{list.status}</td>
                                <td className="!px-2 !py-1 border-b">
                                    <button
                                        onClick={() => handleEdit(list._id)}
                                        className="!px-4 !mr-5 bg-blue-500 text-white rounded"
                                    > Edit
                                    </button>                                    
                                    <button
                                        onClick={() => handleDelete(list._id)}
                                        className="bg-red-500 text-white !px-4 rounded"
                                    > Delete
                                    </button>                                  
                                </td>
                            </tr>
                        ))
                    }
                {/* Add more rows as needed */}
                </tbody>
            </table>    
        </div>

    );
}