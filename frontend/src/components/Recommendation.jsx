import { useState } from "react";

export default function Recommendations() {
    const [activeTab, setActiveTab] = useState("plan");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);

    const tabs = [
        { id: "plan", label: "Based on Nutritional Goals", icon: "🎯" },
        { id: "search", label: "Based on Search", icon: "🔍" }
    ];

    const nutritionalCategories = {
        macronutrients: [
            { id: "high-protein", label: "High Protein", description: ">15g per 100g - for muscle building, satiety", color: "blue" },
            { id: "low-carb", label: "Low Carb", description: "<10g per 100g - for keto, diabetes management", color: "green" },
            { id: "high-fiber", label: "High Fiber", description: ">10g per 100g - for digestive health, weight management", color: "orange" },
            { id: "low-fat", label: "Low Fat", description: "<3g per 100g - for heart health, calorie control", color: "purple" },
            { id: "low-sugar", label: "Low Sugar", description: "<5g per 100g - for diabetes, dental health", color: "red" }
        ],
        calories: [
            { id: "low-calorie", label: "Low Calorie", description: "<100 kcal per 100g - for weight loss", color: "green" },
            { id: "high-calorie", label: "High Calorie", description: ">300 kcal per 100g - for weight gain, athletes", color: "red" },
            { id: "moderate-calorie", label: "Moderate Calorie", description: "100-300 kcal per 100g - for maintenance", color: "yellow" }
        ],
        minerals: [
            { id: "high-iron", label: "High Iron", description: ">5mg per 100g - for anemia prevention, energy", color: "red" },
            { id: "high-calcium", label: "High Calcium", description: ">100mg per 100g - for bone health", color: "blue" },
            { id: "low-sodium", label: "Low Sodium", description: "<100mg per 100g - for hypertension, heart health", color: "green" },
            { id: "cholesterol-free", label: "Cholesterol Free", description: "0mg - for heart health", color: "purple" }
        ],
        vitamins: [
            { id: "vitamin-c-rich", label: "Vitamin C Rich", description: ">10mg per 100g - for immunity, antioxidants", color: "orange" },
            { id: "low-vitamin-c", label: "Low Vitamin C", description: "<5mg per 100g - for those with specific restrictions", color: "gray" }
        ]
    };

    const toggleFilter = (filterId) => {
        setSelectedFilters(prev => {
            // Find which category this filter belongs to
            const filterCategory = Object.entries(nutritionalCategories).find(([key, categories]) => 
                categories.some(cat => cat.id === filterId)
            )?.[0];

            // For calories and vitamins, only allow one selection per category
            if (filterCategory === 'calories' || filterCategory === 'vitamins') {
                const categoryFilters = nutritionalCategories[filterCategory].map(cat => cat.id);
                
                // If this filter is already selected, deselect it
                if (prev.includes(filterId)) {
                    return prev.filter(id => id !== filterId);
                }
                
                // Otherwise, remove any other filters from this category and add this one
                return prev.filter(id => !categoryFilters.includes(id)).concat(filterId);
            }
            
            // For other categories, allow multiple selections
            return prev.includes(filterId) 
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId];
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters([]);
    };

    const categoryLabels = {
        macronutrients: 'Macronutrients',
        calories: 'Calories',
        minerals: 'Minerals',
        vitamins: 'Vitamins'
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-center mb-4">Food Recommendations</h1>
                
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 max-w-4xl mx-auto">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
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
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Tab Content */}
                {activeTab === "plan" && (
                    <div className="p-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h2 className="text-lg font-semibold mb-2">Your Current Nutritional Plan</h2>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span>🎯 Goal: Weight Loss</span>
                                <span>🔥 Calories: 1800/day</span>
                                <span>💪 Protein: 120g</span>
                                <span>🥬 Fiber: 25g</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">Recommended for Your Plan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Plan-based recommendations */}
                            <FoodCard 
                                name="Grilled Chicken Breast"
                                calories="231"
                                protein="43.5g"
                                fat="5g"
                                carbs="0g"
                                tags={["High Protein", "Low Carb"]}
                                badge="✨ Recommended"
                                badgeColor="green"
                            />
                            <FoodCard 
                                name="Quinoa"
                                calories="120"
                                protein="4.4g"
                                fat="1.9g"
                                carbs="22g"
                                tags={["Complete Protein", "High Fiber"]}
                                badge="🎯 Plan Match"
                                badgeColor="blue"
                            />
                            <FoodCard 
                                name="Salmon"
                                calories="208"
                                protein="25.4g"
                                fat="12.4g"
                                carbs="0g"
                                tags={["Omega-3", "High Protein"]}
                                badge="✨ Recommended"
                                badgeColor="green"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "search" && (
                    <div className="p-6">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-2xl font-bold mb-2">Start Your Food Search</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Find the best foods by searching by name and filtering by nutritional categories. 
                                Select your criteria below and click search to discover foods that match your needs.
                            </p>
                        </div>

                        {/* Search Form */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                                {/* Search Input */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 max-w-2xl mx-auto">
                                        <label htmlFor="food-search" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                            🔍 Search:
                                        </label>
                                        <input 
                                            id="food-search"
                                            type="text" 
                                            placeholder="Enter food name (e.g., chicken, salmon, spinach)..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Nutritional Categories */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Filter by Nutritional Categories</h3>
                                        {selectedFilters.length > 0 && (
                                            <button 
                                                onClick={clearAllFilters}
                                                className="text-sm text-red-600 hover:text-red-800 underline font-medium"
                                            >
                                                Clear All ({selectedFilters.length})
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(nutritionalCategories).map(([categoryKey, categories]) => (
                                            <div key={categoryKey} className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-700 mb-3 text-center">
                                                    {categoryLabels[categoryKey]}
                                                </h4>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {categories.map((filter) => (
                                                        <FilterButton
                                                            key={filter.id}
                                                            filter={filter}
                                                            isSelected={selectedFilters.includes(filter.id)}
                                                            onClick={() => toggleFilter(filter.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <button 
                                        onClick={() => {/* Handle search submit */}}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
                                        disabled={!searchTerm && selectedFilters.length === 0}
                                    >
                                        🔍 Search Foods
                                    </button>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {searchTerm || selectedFilters.length > 0 
                                            ? `Search with: ${searchTerm ? `"${searchTerm}"` : ''} ${selectedFilters.length > 0 ? `+ ${selectedFilters.length} filters` : ''}`
                                            : 'Enter a food name or select filters to search'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Search Results Section */}
                        {(searchTerm || selectedFilters.length > 0) && (
                            <div className="max-w-6xl mx-auto">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-xl font-semibold">Search Results</h3>
                                            <p className="text-gray-600 text-sm">
                                                {searchTerm && `Searching for: "${searchTerm}"`}
                                                {searchTerm && selectedFilters.length > 0 && " • "}
                                                {selectedFilters.length > 0 && `${selectedFilters.length} filters applied`}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Found: 6 foods
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Mock search results - in real app, this would filter actual data */}
                                        {(!searchTerm || searchTerm.toLowerCase().includes('chicken')) && (
                                            <FoodCard 
                                                name="Grilled Chicken Breast"
                                                calories="231"
                                                protein="43.5g"
                                                fat="5g"
                                                carbs="0g"
                                                tags={["High Protein", "Low Carb"]}
                                                badge="✨ Match"
                                                badgeColor="green"
                                            />
                                        )}
                                        {(!searchTerm || searchTerm.toLowerCase().includes('salmon')) && (
                                            <FoodCard 
                                                name="Salmon Fillet"
                                                calories="208"
                                                protein="25.4g"
                                                fat="12.4g"
                                                carbs="0g"
                                                tags={["Omega-3", "High Protein"]}
                                                badge="✨ Match"
                                                badgeColor="green"
                                            />
                                        )}
                                        {(!searchTerm || searchTerm.toLowerCase().includes('egg')) && (
                                            <FoodCard 
                                                name="Eggs"
                                                calories="155"
                                                protein="13g"
                                                fat="11g"
                                                carbs="1.1g"
                                                tags={["Complete Protein", "Choline"]}
                                                badge="✨ Match"
                                                badgeColor="green"
                                            />
                                        )}
                                        {(!searchTerm || searchTerm.toLowerCase().includes('spinach')) && (
                                            <FoodCard 
                                                name="Fresh Spinach"
                                                calories="23"
                                                protein="2.9g"
                                                fat="0.4g"
                                                carbs="3.6g"
                                                iron="2.7mg"
                                                tags={["Iron Rich", "Low Calorie"]}
                                                badge="✨ Match"
                                                badgeColor="green"
                                            />
                                        )}
                                        {(!searchTerm || searchTerm.toLowerCase().includes('avocado')) && (
                                            <FoodCard 
                                                name="Avocado"
                                                calories="160"
                                                protein="2g"
                                                fat="15g"
                                                carbs="9g"
                                                tags={["Healthy Fats", "Fiber"]}
                                                badge="✨ Match"
                                                badgeColor="green"
                                            />
                                        )}
                                        {(!searchTerm || searchTerm.toLowerCase().includes('banana')) && (
                                            <FoodCard 
                                                name="Banana"
                                                calories="89"
                                                protein="1.1g"
                                                fat="0.3g"
                                                carbs="23g"
                                                tags={["Potassium", "Natural Sugar"]}
                                                badge="✨ Match"
                                                badgeColor="green"
                                            />
                                        )}
                                    </div>

                                    {/* No results message */}
                                    {searchTerm && !['chicken', 'salmon', 'egg', 'spinach', 'avocado', 'banana'].some(food => 
                                        searchTerm.toLowerCase().includes(food)) && (
                                        <div className="text-center py-12">
                                            <div className="text-4xl mb-4">😔</div>
                                            <p className="text-gray-500 text-lg mb-2">No results found for "{searchTerm}"</p>
                                            <p className="text-gray-400 text-sm mb-4">Try searching for: chicken, salmon, eggs, spinach, avocado, or banana</p>
                                            <button 
                                                onClick={() => setSearchTerm("")}
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Clear search and try again
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "protein" && (
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4">High Protein Foods (15g+)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FoodCard 
                                name="Chicken Breast"
                                calories="231"
                                protein="43.5g"
                                fat="5g"
                                carbs="0g"
                                tags={["Lean Protein", "Low Fat"]}
                                badge="💪 Top Protein"
                                badgeColor="blue"
                            />
                            <FoodCard 
                                name="Greek Yogurt"
                                calories="130"
                                protein="23g"
                                fat="4g"
                                carbs="9g"
                                tags={["Probiotics", "Calcium"]}
                                badge="🥛 Dairy Protein"
                                badgeColor="purple"
                            />
                            <FoodCard 
                                name="Tuna"
                                calories="116"
                                protein="25.5g"
                                fat="0.8g"
                                carbs="0g"
                                tags={["Lean Fish", "Low Calorie"]}
                                badge="🐟 Marine Protein"
                                badgeColor="blue"
                            />
                        </div>
                    </div>
                )}






            </div>

        </div>
    );
}

// Helper component for food cards
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
                <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors">
                    + Add to List
                </button>
                <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300 transition-colors">
                    Compare
                </button>
            </div>
        </div>
    );
}

// Helper component for filter buttons
function FilterButton({ filter, isSelected, onClick }) {
    const getColorClasses = (color, isSelected) => {
        const baseColors = {
            blue: isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
            green: isSelected ? "bg-green-500 text-white border-green-500" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
            red: isSelected ? "bg-red-500 text-white border-red-500" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
            purple: isSelected ? "bg-purple-500 text-white border-purple-500" : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
            orange: isSelected ? "bg-orange-500 text-white border-orange-500" : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
            yellow: isSelected ? "bg-yellow-500 text-white border-yellow-500" : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
            gray: isSelected ? "bg-gray-500 text-white border-gray-500" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
        };
        return baseColors[color] || baseColors.gray;
    };

    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${getColorClasses(filter.color, isSelected)}`}
            title={filter.description}
        >
            {filter.label}
        </button>
    );
}

// Helper component for category cards
function CategoryCard({ icon, title, count, color, onClick }) {
    const getColorClasses = (color) => {
        const colors = {
            red: "bg-red-100 border-red-200 hover:bg-red-200",
            blue: "bg-blue-100 border-blue-200 hover:bg-blue-200",
            green: "bg-green-100 border-green-200 hover:bg-green-200",
            yellow: "bg-yellow-100 border-yellow-200 hover:bg-yellow-200"
        };
        return colors[color] || "bg-gray-100 border-gray-200 hover:bg-gray-200";
    };

    return (
        <div 
            className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${getColorClasses(color)}`}
            onClick={onClick}
        >
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{count}</p>
        </div>
    );
}