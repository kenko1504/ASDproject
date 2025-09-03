import "../CSS/index.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GroceryList() {
    const [form, setForm] = useState({
        GL_Name: "", 
        GL_Date: "", 
        GL_Note: "", 
        GL_Status: "On-Going"
    });

    const [lists, setLists] = useState([])
        useEffect(() => {
        axios.get('http://localhost:5001/GroceryLists')
            .then(lists => setUsers(lists.data))
            .catch(err => console.log(err))
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
    setForm({
        GL_Name: "", 
        GL_Date: "", 
        GL_Note: "", 
        GL_status: "On-Going"
    });
};

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/GroceryLists", {
            name: form.GL_Name,
            date: form.GL_Date,
            note: form.GL_Note,
            status: form.GL_Status
        })
            .then(res => {
                console.log(res.data.message);
                resetForm();
            })
            .catch(err => console.error(err));
    };
    
    return (
        <div className="w-full h-screen flex items-center flex-col bg-red-50 !px-3 !py-3 rounded-2xl shadow-md">
            <h1 className="justify-self-center text-3xl font-bold text-gray-800">Grocery List</h1>
            {/* <div className="grid grid-cols-3 w-full !mb-3">
                <label for="GroceryListName">
                    name:
                    <input type="text"
                    className="ml-2 p-1 border border-gray-300 rounded" 
                    placeholder="Item name..." />
                </label>
                <label>date:
                    <input type="date" className="ml-2 p-1 border border-gray-300 rounded" placeholder="Date..." />
                </label>
                <button className="justify-self-start !px-3 !py-1 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">Add</button> 
                
            </div> */}


            <form onSubmit={handleSubmit} className="flex flex-row !mb-3 !gap-2">
                <label for="GL_Name">Name:</label>
                <input  name="GL_Name" type="text" placeholder="list name..." value={form.GL_Name} onChange={handleChange} required />
                <label for="GL_Date">Date:</label>
                <input name="GL_Date" type="date" placeholder="" value={form.GL_Date} onChange={handleChange} required />
                <label for="GL_Note">Note:</label>
                <input  name="GL_Note" type="text" placeholder="list name..." value={form.GL_Note} onChange={handleChange} required />
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
                        lists.map((list) => {
                            <tr>
                                <td className="px-4 py-2 border-b">{list.name}</td>
                                <td className="px-4 py-2 border-b">{list.date}</td>
                                <td className="px-4 py-2 border-b">{list.status}</td>
                                <td className="px-4 py-2 border-b">Edit/Delete</td>
                            </tr>
                        })
                    }
                {/* Add more rows as needed */}
                </tbody>
            </table>    
        </div>

    );
}