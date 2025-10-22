import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { API_BASE_URL } from '../utils/api';
import { getAPI } from '../utils/api';
import axios from 'axios';

function AddRecommendToGrocery({ food, onClose, onSuccess }) {
    const { user } = useContext(AuthContext);
    const [groceryLists, setGroceryLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGroceryLists();
    }, []);

    const fetchGroceryLists = async () => {
        try {
            setIsLoading(true);
            const response = await getAPI(`/GroceryLists/${user._id}`, localStorage.getItem("token"));
            setGroceryLists(response || []);
            console.log("Fetched grocery lists:", response);
        } catch (error) {
            console.error("Error fetching grocery lists:", error);
            setError("Failed to fetch grocery lists");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToList = async (listId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/recommendations/${user._id}/grocery/${listId}`, {
                food: food
            });
            if (response.status === 200) {
                onSuccess("Item added to grocery list!");
                onClose();
            }
        } catch (error) {
            console.error("Error adding item to grocery list:", error);
            setError("Failed to add item to grocery list");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl !p6 w-full max-w-md !m4">
                <div className="flex justify-between items-center !mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Add to Grocery List</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Adding: <span className="font-semibold">{food.foodName}</span>
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center !p-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="!mt-2 text-gray-600">Loading grocery lists...</p>
                    </div>
                ) : error ? (
                    <div className="text-center !p-8">
                        <p className="text-red-500">{error}</p>
                        <button 
                            onClick={fetchGroceryLists}
                            className="!mt-2 !p-4 !p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                ) : groceryLists.length === 0 ? (
                    <div className="text-center !p-8">
                        <p className="text-gray-600 !mb-4">No grocery lists found</p>
                        <p className="text-sm text-gray-500">Create a grocery list first to add items to it.</p>
                    </div>
                ) : (
                    <div className="max-h-60 overflow-y-auto">
                        <h3 className="text-sm font-medium text-gray-700 !mb-3">Select a grocery list:</h3>
                        <div className="space-y-2">
                            {groceryLists.map((list) => (
                                <button
                                    key={list._id}
                                    onClick={() => handleAddToList(list._id)}
                                    className="w-full text-left !p3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-800">{list.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(list.date).toLocaleDateString()}
                                            </p>
                                            {list.note && (
                                                <p className="text-xs text-gray-400 mt-1">{list.note}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-2 !p-1 text-xs rounded-full ${
                                                list.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {list.status}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="!mt-6 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="!px-4 !p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRecommendToGrocery;