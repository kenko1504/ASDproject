import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../utils/api.js";
import { getUserRoleFromToken } from "../contexts/AuthContext.jsx";

import uploadImg from "../assets/Upload.svg";
import searchImg from "../assets/search-svgrepo-com.svg";
import NutritionPopupModal from './NutritionPopupModal.jsx';

// Recipe Images
import R1Img from "../assets/recipeImages/Recipe1.jpg";
import R2Img from "../assets/recipeImages/Recipe2.jpg";
import R3Img from "../assets/recipeImages/Recipe3.jpg";
import R4Img from "../assets/recipeImages/Recipe4.jpg";
import R5Img from "../assets/recipeImages/Recipe5.jpg";
import R6Img from "../assets/recipeImages/Recipe6.jpg";
import R7Img from "../assets/recipeImages/Recipe7.jpg";
import R8Img from "../assets/recipeImages/Recipe8.jpg";
import R9Img from "../assets/recipeImages/Recipe9.jpg";
import R10Img from "../assets/recipeImages/Recipe10.jpg";

export default function AddRecipe() {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        hours: 0,
        minutes: 0,
        difficulty: 'Easy',
        description: '',
        image: ''
    });
    
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState(['']);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCleaning, setIsCleaning] = useState(false);

    
    // Default recipe images
    const defaultImages = [
        { path: R1Img, name: 'Recipe1' },
        { path: R2Img, name: 'Recipe2' },
        { path: R3Img, name: 'Recipe3' },
        { path: R4Img, name: 'Recipe4' },
        { path: R5Img, name: 'Recipe5' },
        { path: R6Img, name: 'Recipe6' },
        { path: R7Img, name: 'Recipe7' },
        { path: R8Img, name: 'Recipe8' },
        { path: R9Img, name: 'Recipe9' },
        { path: R10Img, name: 'Recipe10' },
    ];

    // Search ingredient function
    const searchIngredients = async (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }
        
        try {
            const response = await fetch("http://localhost:5000/Food");
            const data = await response.json();
            
            // Filter results based on search term
            const filteredData = data.filter(food => 
                food.foodName.toLowerCase().includes(term.toLowerCase())
            );
            
            // Transform the food data to include all nutritional information
            const transformedResults = filteredData.map(food => ({
                _id: food._id,
                name: food.foodName,
                foodName: food.foodName,
                publicFoodKey: food.publicFoodKey,
                calories: food.calories,
                protein: food.protein,
                fat: food.fat,
                transFat: food.transFat,
                carbohydrates: food.carbohydrates,
                sugar: food.sugar,
                dietaryFiber: food.dietaryFiber,
                cholesterol: food.cholesterol,
                sodium: food.sodium,
                calcium: food.calcium,
                iron: food.iron,
                vitaminC: food.vitaminC
            }));
            
            setSearchResults(transformedResults);
            setShowSearchResults(transformedResults.length > 0);
        } catch (error) {
            console.error('Error searching ingredients:', error);
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addIngredient = (ingredient) => {
        const newIngredient = {
            id: Date.now(), // temporary ID for frontend
            ingredient: ingredient,
            quantity: '',
            measurementType: 'grams'
        };
        setIngredients(prev => [...prev, newIngredient]);
        setSearchTerm('');
        setShowSearchResults(false);
    };

    const updateIngredientQuantity = (id, quantity) => {
        setIngredients(prev => 
            prev.map(ing => 
                ing.id === id ? { ...ing, quantity } : ing
            )
        );
    };

    const updateIngredientMeasurement = (id, measurementType) => {
        setIngredients(prev => 
            prev.map(ing => 
                ing.id === id ? { ...ing, measurementType } : ing
            )
        );
    };

    const removeIngredient = (id) => {
        setIngredients(prev => prev.filter(ing => ing.id !== id));
    };

    const addInstruction = () => {
        setInstructions(prev => [...prev, '']);
    };

    const updateInstruction = (index, value) => {
        setInstructions(prev => 
            prev.map((instruction, i) => 
                i === index ? value : instruction
            )
        );
    };

    const removeInstruction = (index) => {
        setInstructions(prev => prev.filter((_, i) => i !== index));
    };

    const formatTime = (hours, minutes) => {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.name || !formData.description || !formData.image || ingredients.length === 0 || instructions.some(inst => !inst.trim())) {
            alert('Please fill in all required fields and add at least one ingredient with instructions.');
            return;
        }

        try {
            // Prepare data for submission
            const recipeData = {
                name: formData.name,
                cookTime: parseInt(formData.hours) * 60 + parseInt(formData.minutes), // Convert to minutes
                difficulty: formData.difficulty,
                description: formData.description,
                image: formData.image, 
                ingredients: ingredients.map(ing => ({
                    ingredient: ing.ingredient._id,
                    quantity: parseFloat(ing.quantity),
                    measurementType: ing.measurementType
                })),
                instructions: instructions.filter(instruction => instruction.trim() !== '')
            };

            const response = await authenticatedFetch('http://localhost:5000/recipes', {
                method: 'POST',
                body: JSON.stringify(recipeData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Recipe created successfully:', result);
                alert('Recipe saved successfully!');
                navigate("/recipes");
            } else {
                const error = await response.json();
                console.error('Error creating recipe:', error);
                alert('Error saving recipe: ' + error.error);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again.');
        }
    };

    // Handle seeding dummy recipes
    const handleSeedRecipes = async () => {
        if (!window.confirm('This will create 10 dummy recipes. Continue?')) {
            return;
        }

        setIsSeeding(true);
        try {
            // Pass the correct imported image URLs to the backend
            const imageUrls = defaultImages.map(img => img.path);

            const response = await authenticatedFetch('http://localhost:5000/recipes/seed', {
                method: 'POST',
                body: JSON.stringify({ imageUrls })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                console.log('Dummy recipes created:', result);
            } else {
                const error = await response.json();
                console.error('Error seeding recipes:', error);
                alert('Error seeding recipes: ' + error.error);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsSeeding(false);
        }
    };

    // Handle deleting all generated recipes
    const handleDeleteGeneratedRecipes = async () => {
        if (!window.confirm('This will delete ALL generated recipes. This action cannot be undone. Continue?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await authenticatedFetch('http://localhost:5000/recipes/generated', {
                method: 'DELETE'
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                console.log('Generated recipes deleted:', result);
            } else {
                const error = await response.json();
                console.error('Error deleting generated recipes:', error);
                alert('Error deleting generated recipes: ' + error.error);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle cleaning up orphaned recipe references
    const handleCleanupOrphanedReferences = async () => {
        if (!window.confirm('This will clean up orphaned recipe references from all users. Continue?')) {
            return;
        }

        setIsCleaning(true);
        try {
            const response = await authenticatedFetch('http://localhost:5000/recipes/cleanup-orphaned', {
                method: 'POST'
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                console.log('Orphaned references cleaned:', result);
            } else {
                const error = await response.json();
                console.error('Error cleaning orphaned references:', error);
                alert('Error cleaning orphaned references: ' + error.error);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsCleaning(false);
        }
    };

    return (
        <div className="w-full h-full min-h-screen max-h-screen">
            <div className="w-full h-16 relative flex !pt-5">
                <h2 className="title font-semibold text-4xl">Add Recipe</h2>
            </div>
            <br/>

            {/* Main form container */}

            {/* Submit Buttons */}
            <div className="flex w-full space-x-4 relative !mb-4">

                <button className="!px-6 !py-2 bg-[#A6C78A] rounded-full hover:bg-[#95B574] transition-colors font-medium !mr-4"
                    type="button" onClick={handleSubmit}>Save Recipe</button>

                <button
                    className="!px-6 !py-2 bg-[#EEDA45] rounded-full hover:bg-[#E5D53F] transition-colors font-medium !mr-4"
                    type="button"
                    onClick={handleSeedRecipes}
                    disabled={isSeeding || isDeleting || isCleaning}
                >
                    {isSeeding ? 'Creating...' : 'Seed 10 Dummy Recipes'}
                </button>

                <button
                    className="!px-6 !py-2 bg-[#CF7171] rounded-full hover:bg-[#B85F5F] transition-colors font-medium text-white !mr-4"
                    type="button"
                    onClick={handleDeleteGeneratedRecipes}
                    disabled={isSeeding || isDeleting || isCleaning}
                >
                    {isDeleting ? 'Deleting...' : 'Delete All Generated'}
                </button>

                <button
                    className="!px-6 !py-2 bg-[#8B8B8B] rounded-full hover:bg-[#747474] transition-colors font-medium text-white"
                    type="button"
                    onClick={handleCleanupOrphanedReferences}
                    disabled={isSeeding || isDeleting || isCleaning}
                >
                    {isCleaning ? 'Cleaning...' : 'Cleanup Orphaned Refs'}
                </button>

                <button className="!px-6 !py-2 border-2 border-[#A6C78A] rounded-full hover:bg-[#A6C78A] transition-colors font-medium absolute right-0"
                    type="button" onClick={() => navigate("/recipes")}>Cancel</button>
            </div>

            <div className="w-full min-h-10/12 max-h-10/12 overflow-scroll">
                    <div className="w-full flex !mb-8">
                        {/* Image Upload */}
                        <div className="bg-[#D5FAB8] rounded-lg !p-4 w-1/4 !mr-8">
                            <h3 className="font-semibold text-lg !mb-4">Recipe Image</h3>
                            <div className="w-full aspect-square border-3 border-dashed border-[#A6C78A] rounded-lg !mb-4">
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#E5F3DA]">
                                        <img src={uploadImg} className="w-6 h-6 !mb-4"/>
                                        <p className="font-medium">Select an image below</p>
                                    </div>
                                )}
                            </div>
                            <select
                                value={formData.image}
                                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                className="w-full !px-3 !py-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none bg-white"
                                required
                            >
                                <option value="">Select an image...</option>
                                {defaultImages.map((img, index) => (
                                    <option key={index} value={img.path}>
                                        {img.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Basic Recipe Information */}
                        <div className="bg-[#D5FAB8] rounded-lg !p-4 w-3/4">
                            <h3 className="font-semibold text-lg !mb-4">Recipe Details</h3>
                        
                            {/* Recipe Name */}
                            <div className="!mb-4">
                                <label className="block font-medium !mb-2">Recipe Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full !px-3 !py-2 border-2 border-[#A6C78A] rounded-full focus:outline-none bg-white"
                                    placeholder="Enter recipe name"
                                />
                            </div>

                            {/* Cook Time and Difficulty */}
                            <div className="flex space-x-4 !mb-4">
                                <div className="flex-1">
                                    <label className="block font-medium !mb-2">Cook Time *</label>
                                    <div className="flex space-x-2 items-center">
                                        <input
                                            type="number"
                                            name="hours"
                                            value={formData.hours}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="23"
                                            className="w-20 !px-3 !py-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none"
                                        />
                                        <span className="font-medium">:</span>
                                        <input
                                            type="number"
                                            name="minutes"
                                            value={formData.minutes}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="59"
                                            className="w-20 !px-3 !py-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none"
                                        />
                                        <span className="!ml-2 font-medium">
                                            {formatTime(formData.hours, formData.minutes)}
                                        </span>
                                    </div>
                                </div>
                            
                                <div className="flex-1">
                                    <label className="block font-medium !mb-2">Difficulty *</label>
                                    <div className="flex">
                                        {['Easy', 'Medium', 'Hard'].map((diff, index) => (
                                            <button
                                                key={diff}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, difficulty: diff }))}
                                                className={`flex-1 border-2 border-[#A6C78A] !py-2 transition ${
                                                    index === 0 ? 'rounded-l-lg border-r-0' : 
                                                    index === 2 ? 'rounded-r-lg border-l-0' : 'border-l-0 border-r-0'
                                                } ${
                                                    formData.difficulty === diff ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'
                                                }`}
                                            >
                                                {diff}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-medium !mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    className="w-full !px-3 !py-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none resize-none bg-white"
                                    placeholder="Describe your recipe..."
                                />
                            </div>
                        </div>                        
                    </div>
                    
                    <div className="w-full h-fit flex">
                    {/* Instructions */}
                    <div className="bg-[#D5FAB8] rounded-lg !p-4 w-1/2 !mr-8 h-fit">
                        <div className="flex items-center justify-between !mb-4">
                            <h3 className="font-semibold text-lg">Instructions</h3>
                            <button
                                type="button"
                                onClick={addInstruction}
                                className="flex items-center space-x-2 !px-4 !py-2 bg-[#A6C78A] rounded-lg hover:bg-[#95B574] transition-colors"
                            >
                                <span className="text-lg !mr-1">+</span>
                                <span className="">Add Step</span>
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {instructions.map((instruction, index) => (
                                <div key={index} className="flex items-start space-x-3 !mb-2">
                                    <span className="w-8 h-17 bg-[#A6C78A] text-white rounded-l-lg flex items-center justify-center font-semibold">
                                        {index + 1}
                                    </span>
                                    <textarea
                                        value={instruction}
                                        onChange={(e) => updateInstruction(index, e.target.value)}
                                        className={`flex-1 !px-3 !py-2 border-2 border-[#A6C78A] bg-white focus:outline-none resize-none ${instructions.length == 1 ? 'rounded-r-lg' : ''}`}
                                        placeholder={`Step ${index + 1} instructions...`}
                                        rows="2"
                                    />
                                    {instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(index)}
                                            className="flex-shrink-0 text-white bg-[#A6C78A] hover:text-[#CF7171] h-17 w-8 rounded-r-lg font-bold"
                                        >
                                            <span className="text-xl">×</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Ingredients */}
                    <div className="bg-[#D5FAB8] rounded-lg !p-4 w-1/2 h-fit">
                        <div className="flex justify-between items-center !mb-4">
                            <h3 className="font-semibold text-lg">Ingredients</h3>
                            <button
                                onClick={() => setShowNutritionModal(true)}
                                className="flex items-center space-x-2 !px-4 !py-2 bg-[#A6C78A] rounded-lg hover:bg-[#95B574] transition-colors"
                            >
                                Nutrition
                            </button>
                        </div>
                        
                        {/* Ingredient Search */}
                        <div className="relative !mb-4">
                            <div className="relative">
                                <img src={searchImg} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"/>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        searchIngredients(e.target.value);
                                    }}
                                    className="w-full !pl-10 !pr-4 !py-2 border-2 border-[#A6C78A] rounded-full focus:outline-none"
                                    placeholder="Search for ingredients..."
                                />
                            </div>
                            
                            {/* Search Results */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute z-10 w-full !mt-1 bg-white border-2 border-[#A6C78A] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {searchResults.map((ingredient) => (
                                        <div
                                            key={ingredient._id}
                                            onClick={() => addIngredient(ingredient)}
                                            className="!px-4 !py-2 hover:bg-[#E5F3DA] cursor-pointer flex justify-between items-center border-b-2 border-[#A6C78A] last:border-b-0"
                                        >
                                            <span className="font-medium">{ingredient.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Added Ingredients */}
                        <div className="space-y-2">
                            {ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="flex items-center min-h-10 !pl-4 border-[#A6C78A] bg-white border-2 !mb-2 rounded-lg">
                                    <span className="flex-1 font-medium flex items-center">{ingredient.ingredient.name}</span>
                                    <input
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => updateIngredientQuantity(ingredient.id, e.target.value)}
                                        placeholder="Amt"
                                        className="w-1/6 border-x-2 !px-2 border-[#A6C78A] self-stretch focus:outline-none"
                                    />
                                    <select
                                        value={ingredient.measurementType}
                                        onChange={(e) => updateIngredientMeasurement(ingredient.id, e.target.value)}
                                        className="w-1/6 !px-2 self-stretch focus:outline-none"
                                    >
                                        <option value="grams">grams</option>
                                        <option value="ml">ml</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(ingredient.id)}
                                        className="text-white transition bg-[#A6C78A] hover:text-[#CF7171] font-bold w-10 self-stretch"
                                    >
                                        <span className="text-xl">×</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
            </div>

            {/* Nutrition Modal */}
            <NutritionPopupModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
                ingredients={ingredients}
            />
        </div>
    );
}