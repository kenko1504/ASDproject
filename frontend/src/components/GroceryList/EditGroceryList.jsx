import { useState, useEffect } from "react";

export default function EditGroceryList({ isOpen, onClose, list, onUpdate }) {
    const [editForm, setEditForm] = useState({
        _id: "",
        name: "",
        date: "",
        note: "",
        status: "active"
    });

    // Update form when list prop changes
    useEffect(() => {
        if (list) {
            setEditForm(list);
        }
    }, [list]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const success = await onUpdate(editForm);
        if (success) {
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
        setEditForm({ _id: "", name: "", date: "", note: "", status: "active" });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white !p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold !mb-10 text-center">Edit Grocery List</h2>
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                    <label className="flex justify-between items-center">
                        <span className="font-semibold">Name:</span>
                        <input 
                            name="name" 
                            value={editForm.name} 
                            onChange={handleEditChange} 
                            className="border border-gray-300 !p-1 rounded" 
                            required 
                        />
                    </label>
                    <label className="flex justify-between items-center">
                        <span className="font-semibold">Date:</span>
                        <input 
                            name="date" 
                            type="date" 
                            value={editForm.date.slice(0, 10)} 
                            onChange={handleEditChange} 
                            className="border border-gray-300 !p-1 rounded" 
                            required 
                        />
                    </label>
                    <label className="flex justify-between items-center">
                        <span className="font-semibold">Note:</span>
                        <input 
                            name="note" 
                            value={editForm.note} 
                            onChange={handleEditChange} 
                            className="border border-gray-300 !p-1 rounded" 
                        />
                    </label>
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