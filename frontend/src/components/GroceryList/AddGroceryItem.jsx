import { useState } from "react";

export default function AddGroceryItem({ onSubmit, error }) {
    const [item, setItem] = useState({ name: "", quantity: 0, category: "Other" });

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const resetItem = () => {
        setItem({ name: "", quantity: 0, category: "Other" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(item);
        if (success) {
            resetItem();
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
                        placeholder="item name..." 
                        value={item.name} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded !px-3 !py-2 text-base w-48" 
                        required 
                    />
                </div>
                <div className="flex items-center gap-3">
                    <label className="font-semibold text-base">Quantity:</label>
                    <input 
                        name="quantity" 
                        type="number" 
                        placeholder="quantity" 
                        value={item.quantity} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded !px-3 !py-2 text-base w-32" 
                        required 
                        min="1" 
                    />
                </div>
                <div className="flex items-center gap-3">
                    <label className="font-semibold text-base">Category:</label>
                    <select 
                        name="category" 
                        value={item.category} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded !px-3 !py-2 text-base w-32" 
                        required
                    >
                        <option value="Meat">Meat</option>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Fruit">Fruit</option>
                        <option value="Drink">Drink</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white rounded !px-6 !py-2 text-base font-medium" type="submit">
                    Add Item
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