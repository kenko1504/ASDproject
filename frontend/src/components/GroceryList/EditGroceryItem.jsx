import { useState, useEffect } from "react";

export default function EditGroceryItem({ isOpen, onClose, item, onUpdate, error }) {
    const [editItem, setEditItem] = useState({
        _id: "",
        name: "",
        quantity: 0,
        category: "Other"
    });

    // Update form when item prop changes
    useEffect(() => {
        if (item) {
            setEditItem(item);
        }
    }, [item]);

    const handleEditChange = (e) => {
        setEditItem({ ...editItem, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const success = await onUpdate(editItem);
        if (success) {
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
        setEditItem({ _id: "", name: "", quantity: 0, category: "Other" });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white !p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold !mb-10 text-center">Edit Item</h2>
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                    <label className="flex justify-between items-center">
                        <span className="font-semibold">Name:</span>
                        <input 
                            name="name" 
                            value={editItem.name} 
                            onChange={handleEditChange} 
                            className="border border-gray-300 !p-1 rounded" 
                            required 
                        />
                    </label>
                    <label className="flex justify-between items-center">
                        <span className="font-semibold">Quantity:</span>
                        <input 
                            name="quantity" 
                            type="number" 
                            value={editItem.quantity} 
                            onChange={handleEditChange} 
                            className="border border-gray-300 !p-1 rounded" 
                            required 
                            min="1"
                        />
                    </label>
                    <label className="flex justify-between items-center">
                        <span className="font-semibold">Category:</span>
                        <select 
                            name="category" 
                            value={editItem.category} 
                            onChange={handleEditChange} 
                            className="border border-gray-300 !p-1 rounded"
                        >
                            <option value="Meat">Meat</option>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Fruit">Fruit</option>
                            <option value="Drink">Drink</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    {/* Error Message Display */}
                    <div className="!h-6 flex items-center justify-center !mb-3">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 !px-2 !py-1 rounded !max-w-md">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 !mt-2">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            className="bg-gray-300 !px-3 !py-1 rounded"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white !px-3 !py-1 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}