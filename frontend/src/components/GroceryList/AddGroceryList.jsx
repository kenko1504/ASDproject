import { useState } from "react";
import { today } from "../../utils/dateUtils";


export default function AddGroceryList({ onSubmit, error }) {
    const [form, setForm] = useState({
        name: "", 
        date: today(), 
        note: "", 
        status: "active"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const resetForm = () => {
        setForm({ 
            name: "", 
            date: today(), 
            note: "", 
            status: "active" 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(form);
        if (success) {
            resetForm();
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <form onSubmit={handleSubmit} className="flex flex-row items-center gap-6 border border-gray-300 rounded !px-8 !py-6 !mb-3 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                    <label className="font-semibold text-base">Name:</label>
                    <input 
                        name="name" 
                        type="text" 
                        placeholder="list name..." 
                        value={form.name} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded !px-3 !py-2 text-base w-48" 
                        required 
                    />
                </div>
                <div className="flex items-center gap-3">
                    <label className="font-semibold text-base">Date:</label>
                    <input 
                        name="date" 
                        type="date" 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded !px-3 !py-2 text-base" 
                        value={form.date || today()}
                        min={today()}
                        required 
                    />
                </div>
                <div className="flex items-center gap-3">
                    <label className="font-semibold text-base">Note:</label>
                    <input 
                        name="note" 
                        type="text" 
                        placeholder="list note..." 
                        value={form.note} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded !px-3 !py-2 text-base w-48" 
                    />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white rounded !px-6 !py-2 text-base font-medium" type="submit">
                    Add List
                </button>
            </form>

            {/* Error Message Display */}
            <div className="!h-6 flex items-center justify-center !mb-3">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 !px-2 !py-1 rounded !max-w-md">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}