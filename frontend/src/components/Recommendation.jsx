import { useState } from "react";
import axios from "axios";

export default function Recommendations() {
    const [activeTab, setActiveTab] = useState("plan");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFoodType, setSelectedFoodType] = useState('Any');

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

            const queryParams = {
                filters: selectedFilters,
                searchTerm,
                foodType: selectedFoodType
            };

            const url = `http://localhost:5000/recommendations/search?query=${encodeURIComponent(JSON.stringify(queryParams))}`;

            const response = await axios.get(url);
            const data = response.data;
            console.log("Search Results:", data);
            alert("Search completed. Check console for results.");
        } catch (error) {
            console.error("Error fetching search results:", error);
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
            <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm min-h-[calc(max(100vh-18vh))] overflow-y-auto">
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
                                        className="bg-blue-600 hover:bg-blue-700 text-white !px-8 !py-1 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
                                    >
                                    Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                )}
            </div>

        </div>
    );
}

// Component for food cards
function FoodCard({ name, calories, protein, fat, carbs, iron, tags, badge, badgeColor }) {
    const getBadgeColor = (color) => {
        const colors = {
            green: "text-green-600 bg-green-100",
            blue: "text-blue-600 bg-blue-100",
            red: "text-red-600 bg-red-100",
            purple: "text-purple-600 bg-purple-100",
            yellow: "text-yellow-600 bg-yellow-100",
            orange: "text-orange-600 bg-orange-100",
            brown: "text-amber-600 bg-amber-100"
        };
        return colors[color] || "text-gray-600 bg-gray-100";
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${getBadgeColor(badgeColor)}`}>
                    {badge}
                </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
                <p>📊 Calories: {calories} per 100g</p>
                <p>💪 Protein: {protein}</p>
                <p>🥑 Fat: {fat}</p>
                <p>🍞 Carbs: {carbs}</p>
                {iron && <p>🩸 Iron: {iron}</p>}
            </div>
            <div className="mb-3">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-white text-gray-700 text-xs px-2 py-1 rounded mr-1 border">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex space-x-2">
                <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded">
                    {/* Button content */}
                </button>
            </div>
        </div>
    );
}