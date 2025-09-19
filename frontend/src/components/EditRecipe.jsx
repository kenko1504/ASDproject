import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import uploadImg from "../assets/Upload.svg";
import searchImg from "../assets/search-svgrepo-com.svg";
import sampleProfilePic from "../assets/SampleProfilePic.jpg";

export default function EditRecipe() {
    const navigate = useNavigate();
    const { recipeId } = useParams();
    
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    // Default recipe images
    const defaultImages = [
        { path: sampleProfilePic, name: 'MAN' },
    ];

    // Fetch recipe data for editing
    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/recipes/${recipeId}`);

            if (response.ok) {
                const recipe = await response.json();

                // Convert cook time from minutes to hours and minutes
                const hours = Math.floor(recipe.cookTime / 60);
                const minutes = recipe.cookTime % 60;

                // Set form data
                setFormData({
                    name: recipe.name,
                    hours: hours,
                    minutes: minutes,
                    difficulty: recipe.difficulty,
                    description: recipe.description,
                    image: recipe.image
                });

                // Set ingredients with temporary IDs for frontend
                const ingredientsWithIds = recipe.ingredients.map((ing, index) => ({
                    id: Date.now() + index,
                    ingredient: ing.ingredient,
                    quantity: ing.quantity.toString(),
                    measurementType: ing.measurementType
                }));
                setIngredients(ingredientsWithIds);

                // Set instructions
                setInstructions(recipe.instructions);

            } else {
                setError('Recipe not found');
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
            setError('Error loading recipe');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (recipeId) {
            fetchRecipe();
        }
    }, [recipeId]);

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
            
            // Transform the food data to match ingredient structure
            const transformedResults = filteredData.map(food => ({
                _id: food._id,
                name: food.foodName,
                publicFoodKey: food.publicFoodKey
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

            const response = await fetch(`http://localhost:5000/recipes/${recipeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Recipe updated successfully:', result);
                alert('Recipe updated successfully!');
                navigate(`/recipe/${recipeId}`);
            } else {
                const error = await response.json();
                console.error('Error updating recipe:', error);
                alert('Error updating recipe: ' + error.error);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full min-h-screen max-h-screen flex items-center justify-center">
                <p className="text-lg">Loading recipe...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full min-h-screen max-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-600">{error}</p>
                    <button
                        onClick={() => navigate("/recipes")}
                        className="mt-4 px-6 py-2 bg-[#A6C78A] rounded-lg hover:bg-[#95B574] transition-colors"
                    >
                        Back to Recipes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-screen max-h-screen">
            {/* Header matching the recipes page style */}
            <div className="w-full h-16 relative flex !pt-5">
                <h2 className="title font-semibold text-4xl">Edit Recipe</h2>
            </div>
            <br/>

            {/* Main form container */}

            {/* Submit Buttons */}
            <div className="flex w-full space-x-4 relative !mb-4">

                <button className="!px-6 !py-2 bg-[#A6C78A] rounded-full hover:bg-[#95B574] transition-colors font-medium"
                    type="button" onClick={handleSubmit}>Update Recipe</button>

                <button className="!px-6 !py-2 border-2 border-[#A6C78A] rounded-full hover:bg-[#A6C78A] transition-colors font-medium absolute right-0"
                    type="button" onClick={() => navigate(`/recipe/${recipeId}`)}>Cancel</button>
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
                        <h3 className="font-semibold text-lg !mb-4">Ingredients</h3>
                        
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
                                <div key={ingredient.id} className="flex items-center h-10 !pl-4 border-[#A6C78A] bg-white border-2 !mb-2 rounded-lg">
                                    <span className="flex-1 font-medium">{ingredient.ingredient?.foodName || ingredient.ingredient?.name || 'Unknown ingredient'}</span>
                                    <input
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => updateIngredientQuantity(ingredient.id, e.target.value)}
                                        placeholder="Amt"
                                        className="w-1/6 border-x-2 !px-2 border-[#A6C78A] h-full focus:outline-none"
                                    />
                                    <select
                                        value={ingredient.measurementType}
                                        onChange={(e) => updateIngredientMeasurement(ingredient.id, e.target.value)}
                                        className="w-1/6 !px-2 h-full focus:outline-none"
                                    >
                                        <option value="grams">grams</option>
                                        <option value="ml">ml</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(ingredient.id)}
                                        className="text-white transition bg-[#A6C78A] hover:text-[#CF7171] font-bold w-10 h-full"
                                    >
                                        <span className="text-xl">×</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}