import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

import { API_BASE_URL } from '../utils/api.js';
import AddRecommendToGrocery from './AddRecommendToGrocery';
export default function Recommendations() {
    const userInfo = useContext(AuthContext)

    const [activeTab, setActiveTab] = useState("plan");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchError, setSearchError] = useState("");
    const [selectedFoodType, setSelectedFoodType] = useState('Any');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recFilter, setRecFilter] = useState("proteinList");

    const [nutrients, setNutrients] = useState(null)
    const [userTodayMeal, setUserTodayMeal] = useState(null)
    const [userTodayNutrition, setUserTodayNutrition] = useState(null)

    const [recommendSearchResults, setRecommendSearchResults] = useState(null)
   

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

    const nutritionalCategoriesForRecommendations = [
        { id: "proteinList", label: "Protein" },
        { id: "carbList", label: "Carbohydrates" },
        { id: "fatList", label: "Fat" },
        { id: "caloriesList", label: "Calories" },
        { id: "sodiumList", label: "Sodium" },
    ];

    const foodTypes = ['Any', 'Meat', 'Vegetable', 'Fruit', 'Drink', 'Other'];

    const toggleFilter = (filterId) => {
        setSelectedFilters((prevFilters) => {
            if (prevFilters.includes(filterId)) {
                // Deselect if already selected
                setSearchError("");
                return prevFilters.filter((id) => id !== filterId);
            } else if (prevFilters.length < 3) {
                // Select if not already selected and limit is not reached
                setSearchError("");
                return [...prevFilters, filterId];
            }
            // Show error message if limit is reached
            setSearchError("You can only select up to 3 filters.");
            return prevFilters;
        });
    };

    const toggleRecommendationFilter = (filterId) => {
        setRecFilter(filterId)
    }

    const clearAllFilters = () => {
        setSearchError("");
        setSelectedFilters([]);
    };

    const handleSubmit = async () => {
        try {
            if (selectedFilters.length === 0) {
                setSearchError("Please select at least one filter.");
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
            setSearchError("Failed to fetch search results. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    async function getNutritionRequirementsInfo(){
            // if (abortControllerRef.current) {
            //     abortControllerRef.current.abort()
            // }

            // abortControllerRef.current = new AbortController()

            try {
                setIsLoading(true)
                setErrorMessage(null)
                
                const body = {
                    characteristics: userInfo.user.characteristics,
                    nutritionPlan: userInfo.user.nutritionPlan
                }

                console.log('API request:', body)
                
                const searchResult = await fetch(`${API_BASE_URL}/nutrition/dailyReq`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                    // signal: abortControllerRef.current.signal
                })
                console.log("SearchResult:", searchResult)
                
                if (!searchResult.ok) {
                    throw new Error(`HTTP error! status: ${searchResult.status}`)
                }
                
                const data = await searchResult.json()
                console.log('API response:', data)
                
                if(data){
                    console.log('Setting nutrients:', data)
                    const nutrientData = {
                        calories: parseFloat(data.calories) || 0,
                        protein: parseFloat(data.protein) || 0,
                        fat: parseFloat(data.fat) || 0,
                        carbohydrates: parseFloat(data.carbohydrate) || 0,
                        sodium: parseFloat(data.sodium) || 0
                    }
                    setNutrients(nutrientData)
                    console.log('Nutrients set:', nutrientData)
                }
                return data
            } catch(error){
                if (error.name === 'AbortError') {
                    console.log('aborted')
                    return null
                }
                console.error("getNutritionInfo() error:", error)
                setErrorMessage(error.message)
                return null
            }
        }

        async function getUserTodayMeal() {
            try {
                const response = await fetch(`${API_BASE_URL}/meal/${userInfo.user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    setUserTodayMeal(data)
                    return data
                } else {
                    console.error('Error fetching user today meal:', response.status)
                    setUserTodayMeal(null)
                    return null
                }
            } catch (error) {
                console.error('Error fetching user today meal:', error)
                setUserTodayMeal(null)
                return null
            }
        }

        async function getUserTodayNutrition(meals) {
            if (!meals || meals.length === 0) {
                setUserTodayNutrition({
                    calories: 0,
                    protein: 0,
                    fat: 0,
                    carbohydrates: 0,
                    sodium: 0
                })
                return
            }

            const nutritionTotals = {
                calories: 0,
                protein: 0,
                fat: 0,
                carbohydrates: 0,
                sodium: 0
            }

            meals.forEach(meal => {
                meal.items.forEach(item => {
                    const ingredient = item.ingredient 
                    if (ingredient) {
                        const multiplier = item.quantity / 100

                        nutritionTotals.calories += (parseFloat(ingredient.calories) * multiplier) || 0
                        nutritionTotals.protein += (parseFloat(ingredient.protein) * multiplier) || 0
                        nutritionTotals.fat += (parseFloat(ingredient.fat) * multiplier) || 0
                        nutritionTotals.carbohydrates += (parseFloat(ingredient.carbohydrates) * multiplier) || 0
                        nutritionTotals.sodium += (parseFloat(ingredient.sodium) * multiplier) || 0
                    }
                })
            })

            console.log('Total nutrition calculated:', nutritionTotals)
            setUserTodayNutrition(nutritionTotals)

            return nutritionTotals
        }

        async function getRecommendedUserFoods(nutritionReqs, todayNutritionTotals){
            if (!nutritionReqs || !todayNutritionTotals) {
                console.error('Missing nutrition data:', { nutritionReqs, todayNutritionTotals })
                return
            }
            
            const criteria = {
                calories: Math.max(0, nutritionReqs.calories - todayNutritionTotals.calories),
                protein: Math.max(0, nutritionReqs.protein - todayNutritionTotals.protein),
                fat: Math.max(0, nutritionReqs.fat - todayNutritionTotals.fat),
                carbohydrates: Math.max(0, nutritionReqs.carbohydrates - todayNutritionTotals.carbohydrates),
                sodium: Math.max(0, nutritionReqs.sodium - todayNutritionTotals.sodium)
            }
            
            console.log("Search Criteria: ", criteria)

            try{
                if(criteria){
                    const result = await fetch(`${API_BASE_URL}/recommendations/${userInfo.user._id}/nutritionBasedSearch`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(criteria)
                    })
                    console.log("Response:", result);
    
                    if (!result.ok) {
                        throw new Error(`HTTP error! status: ${result.status}`);
                    }
                    
                    const data = await result.json();
                    console.log("Parsed data:", data);
                    
                    setRecommendSearchResults(data);
                    return data;
                }else{
                    console.log("Error: invalid criteria", errorMessage)
                }
            }catch(error){
                console.log("getRecommendedUserFoods() error", error)
            }
        }
        async function fetchAllData() {
            try {
                setIsLoading(true)
                setErrorMessage(null)

                const nutrientsData = await getNutritionRequirementsInfo()
                const mealsData = await getUserTodayMeal()
                
                let todayNutritionData
                if (mealsData && mealsData.length > 0) {
                    todayNutritionData = await getUserTodayNutrition(mealsData)
                } else {
                    todayNutritionData = {
                        calories: 0,
                        protein: 0, 
                        carbohydrates: 0,
                        fat: 0,
                        sodium: 0
                    }
                    setUserTodayNutrition(todayNutritionData)
                }
                
                if (nutrientsData && todayNutritionData) {
                    await getRecommendedUserFoods(nutrientsData, todayNutritionData)
                }
                setIsLoading(false)
            } catch (error) {
                console.error('Error:', error)
                setErrorMessage(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        useEffect(() => {
            fetchAllData()
        }, [])
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
                    <div className="p-6 h-full">
                        
                        <h4 className="text-center font-medium text-gray-700 !mb-3">Sort by Nutrition Fills</h4>
                            <div className="grid grid-cols-5 gap-2 !mb-2 !pr-5 !pl-15">
                                {nutritionalCategoriesForRecommendations.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => toggleRecommendationFilter(filter.id)}
                                        className={`!h-7 rounded-lg border text-sm font-medium transition-colors ${
                                            recFilter.includes(filter.id)
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
                        
                        
                        {isLoading && (
                            <div className="text-center text-gray-500">
                                <p>Loading recommendations...</p>
                            </div>
                        )}

                        {errorMessage && !isLoading && (
                            <div className="text-center text-red-500">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {!isLoading && !errorMessage && recommendSearchResults && (
                            <div className="w-full h-full">
                                <div className="text-center w-full font-bold">Top 20 Foods</div>
                                <div className="grid grid-cols-3 gap-4 overflow-scroll h-10/12">
                                    {console.log("Filter:", recFilter)}
                                    {console.log("FilterTest:", recommendSearchResults[recFilter])}

                                    {recommendSearchResults.message ? (
                                        <div className="col-span-3 text-center text-gray-500">
                                            <p>{recommendSearchResults.message}</p>
                                        </div>
                                    ) : (
                                        recommendSearchResults[recFilter]?.map((food, index) => (
                                            <FoodResultCard key={index} food={food}/>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {!isLoading && !errorMessage && recommendSearchResults && recommendSearchResults.length === 0 && (
                            <div className="text-center text-gray-500">
                                <p>No recommendations available. You've met your nutritional goals!</p>
                            </div>
                        )}

                        {!isLoading && !errorMessage && !recommendSearchResults && (
                            <div className="text-center text-gray-500">
                                <p>Loading your personalized recommendations...</p>
                            </div>
                        )}
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
                                                {searchError && (
                                                    <p className="text-center text-red-500 text-sm mt-2">{searchError}</p>
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
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddToGroceryList = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    const handleSuccess = (message) => {
        alert(message);
    };

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                
                <div className="mb-3">
                    <h4 className="text-center font-semibold text-l text-gray-800 !my-2 leading-[1.5rem] h-[3rem]">{food.foodName}</h4>
                </div>
                
                <span className="text-m px-2 bg-blue-100 text-blue-600 !py-2 font-bold flex justify-center rounded !mb-2">{food.type}</span>
                
                <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                    <span className="font-bold !mx-auto">⚡ Calories:</span>
                    <span className="!pl-2">{food.energy}kcal</span>
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

            {showAddPopup && (
                <AddRecommendToGrocery
                    food={food}
                    onClose={handleClosePopup}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}