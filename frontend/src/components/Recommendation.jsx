import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

import { API_BASE_URL } from '../utils/api.js';
export default function Recommendations() {
    const [activeTab, setActiveTab] = useState("plan");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFoodType, setSelectedFoodType] = useState('Any');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    const tabs = [
        { id: "plan", label: "Based on Nutritional Goals", icon: "🎯" },
        { id: "search", label: "Based on Search", icon: "🔍" }
    ];

    const nutritionalCategories = [
        { id: "protein", label: "High Protein" },
        { id: "carbohydrates", label: "Low Carb" },
        { id: "dietaryFiber", label: "High Fiber" },
        { id: "fat", label: "Low Fat" },
        { id: "sugar", label: "Low Sugar" },
        { id: "calories", label: "Low Calorie" },
        { id: "iron", label: "High Iron" },
        { id: "calcium", label: "High Calcium" },
        { id: "sodium", label: "Low Sodium" },
        { id: "cholesterol", label: "Low Cholesterol" },
        { id: "vitaminC", label: "Vitamin C Rich" },
    ];

    const foodTypes = ['Any', 'Meat', 'Vegetable', 'Fruit', 'Drink', 'Other'];
    

    const toggleFilter = (filterId) => {
        setSelectedFilters((prevFilters) => {
            if (prevFilters.includes(filterId)) {
                // Deselect if already selected
                setErrorMessage("");
                return prevFilters.filter((id) => id !== filterId);
            } else if (prevFilters.length < 3) {
                // Select if not already selected and limit is not reached
                setErrorMessage("");
                return [...prevFilters, filterId];
            }
            // Show error message if limit is reached
            setErrorMessage("You can only select up to 3 filters.");
            return prevFilters;
        });
    };

    const clearAllFilters = () => {
        setErrorMessage("");
        setSelectedFilters([]);
    };

    const handleSubmit = async () => {
        try {
            if (selectedFilters.length === 0) {
                setErrorMessage("Please select at least one filter.");
                return;
            }

            setIsLoading(true);
            const queryParams = {
                filters: selectedFilters,
                searchTerm,
                foodType: selectedFoodType
            };

            const url = `${API_BASE_URL}/recommendations/search?query=${encodeURIComponent(JSON.stringify(queryParams))}`;

            const response = await axios.get(url);
            const data = response.data;
            console.log("Search Results:", data);
            setSearchResults(data.results || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setErrorMessage("Failed to fetch search results. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container !mx-auto !p-4">
            {/* Header Section */}
            <div >
                <h1 className="text-3xl font-bold text-center !mb-4">Food Recommendations</h1>
                
                {/* Tab Navigation */}
                <div className="flex max-w-[calc(100vw)] !mx-auto">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 !py-2 rounded-t-xl transition-colors flex items-center justify-center gap-2 ${
                                activeTab === tab.id 
                                    ? 'bg-green-500 text-white shadow-md' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm h-[calc(100vh-18vh)]">
                {/* Tab Content */}
                {activeTab === "plan" && (
                    <div className="p-6">
                        <h1>No Nutritional Plan Found</h1>
                    </div>
                )}

                {activeTab === "search" && (
                    <div className="p-6">
                        {/* Search Form */}
                        <div className="max-w !mx-auto">
                            <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm">
                                {/* Search Input */}
                                <div className="!mb-5">
                                    <div className="flex items-center gap-3 max-w-2xl !mx-auto !pt-4">
                                        <label htmlFor="food-search" className="text-s font-medium text-gray-700 whitespace-nowrap">
                                            Item Search Keyword:
                                        </label>
                                        <input 
                                            id="food-search"
                                            type="text" 
                                            placeholder="Enter food name (e.g., chicken, salmon, spinach, etc...)" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 !p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Filters Section */}
                                <div>                                    
                                    {/* Two-column layout */}
                                    <div className="flex gap-6">
                                        {/* Left side - Nutritional Categories */}
                                        <div className="flex-1">
                                            <h4 className="text-center font-medium text-gray-700 !mb-3">Filter by Nutrition</h4>
                                            <div className="grid grid-cols-4 gap-2 !mb-2 !pr-5 !pl-15">
                                                {nutritionalCategories.map((filter) => (
                                                    <button
                                                        key={filter.id}
                                                        onClick={() => toggleFilter(filter.id)}
                                                        className={`!h-7 rounded-lg border text-sm font-medium transition-colors ${
                                                            selectedFilters.includes(filter.id)
                                                                ? 'bg-blue-500 text-white border-blue-500'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {filter.label}
                                                    </button>
                                                ))}

                                                {selectedFilters.length > 0 && (
                                                    <button 
                                                        onClick={clearAllFilters}
                                                        className="bg-red-500 text-white !h-7 rounded-lg transition-colors hover:bg-red-700 hover:text-gray-200"
                                                    >
                                                        Clear All
                                                    </button>
                                                )}
                                            </div>
                                            <div className="h-5">
                                                {/* More than three filter error message */}
                                                {errorMessage && (
                                                    <p className="text-center text-red-500 text-sm mt-2">{errorMessage}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right side - Food Types */}
                                        <div className="flex-1">
                                            <h4 className="text-center font-medium text-gray-700 !mb-3">Filter by Food Type</h4>
                                            <div className="grid grid-cols-2 gap-2 !mb-2 !pr-15 !pl-5">
                                                {foodTypes.map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setSelectedFoodType(type)}
                                                        className={`!h-7 rounded-lg border text-sm font-medium transition-colors ${
                                                            selectedFoodType === type
                                                                ? 'bg-green-500 text-white border-green-500'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Submit Button */}
                                <div className="text-center !pb-2">
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white !px-8 !py-1 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Searching..." : "Search"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold !pl-2 !mb-4">Search Results per 100g ({searchResults.length})</h3>
                                <div className="grid grid-cols-3 gap-4 overflow-y-auto h-[45vh] !px-2">
                                    {searchResults.map((food, index) => (
                                        <FoodResultCard key={index} food={food}/>
                                    ))}
                                    <div className="h-[15vh]"> {/* Extra space at the bottom for better scrolling*/}
                                    </div>
                                    <div className="h-[15vh]"> {/* Extra space at the bottom for better scrolling*/}
                                    </div>
                                    <div className="h-[15vh]"> {/* Extra space at the bottom for better scrolling*/}
                                    </div>
                                </div>
                            </div>
                        )}

                        {searchResults.length === 0 && !isLoading && (
                            <div className="mt-6 text-center text-gray-500">
                                <p>No results found. Try adjusting your search criteria.</p>
                            </div>
                        )}
                        
                    </div>
                )}
            </div>

        </div>
    );
}

// Card component for search results
function FoodResultCard({ food }) {
    const { user } = useContext(AuthContext);

    const handleAddToGroceryList = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/recommendations/${user._id}/grocery`,{
                food: food
            });
            if (response.status === 200) {
                alert("Item added to grocery list!");
            }
        } catch (error) {
            console.error("Error adding item to grocery list:", error);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-3">
                <h4 className="text-center font-semibold text-l text-gray-800 !my-2 leading-[1.5rem] h-[3rem]">{food.foodName}</h4>
            </div>
            
            <span className="text-m px-2 py-1 bg-blue-100 text-blue-600 !py-2 font-bold flex justify-center rounded !mb-2">{food.type}</span>
            
            <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                <span className="font-bold !mx-auto">⚡ Calories:</span>
                <span className="!pl-2">{food.calories}kcal</span>
                <span className="font-bold !mx-auto">💪 Protein:</span>
                <span className="!pl-2">{food.protein}g</span>
                <span className="font-bold !mx-auto">🍞 Carbs:</span>
                <span className="!pl-2">{food.carbohydrates}g</span>
                <span className="font-bold !mx-auto">🥑 Fat:</span>
                <span className="!pl-2">{food.fat}g</span>
                <span className="font-bold !mx-auto">🌾 Fiber:</span>
                <span className="!pl-2">{food.dietaryFiber}g</span>
                <span className="font-bold !mx-auto">🍯 Sugar:</span>
                <span className="!pl-2">{food.sugar}g</span>
            </div>


            <div className="!mt-3 !pt-3 border-t border-gray-100 ">
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-500">
                    <span className="font-bold !mx-auto">⚡ Calcium:</span>
                    <span className="!pl-2">{food.calcium}mg</span>
                    <span className="font-bold !mx-auto">🩸 Iron:</span>
                    <span className="!pl-2">{food.iron}mg</span>
                    <span className="font-bold !mx-auto">🍊 Vitamin C:</span>
                    <span className="!pl-2">{food.vitaminC}mg</span>
                    <span className="font-bold !mx-auto">🧂 Sodium:</span>
                    <span className="!pl-2">{food.sodium}mg</span>
                    <span className="font-bold !mx-auto">❤️ Cholesterol:</span>
                    <span className="!pl-2">{food.cholesterol}mg</span>
                </div>
            </div>


            <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white !p-1 rounded text-sm transition-colors" onClick={handleAddToGroceryList}>
                    Add to Grocery List
                </button>
            </div>
        </div>
    );
}