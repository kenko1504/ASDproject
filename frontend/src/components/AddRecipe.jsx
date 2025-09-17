import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import uploadImg from "../assets/Upload.svg";
import searchImg from "../assets/search-svgrepo-com.svg";

export default function AddRecipe() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        hours: 0,
        minutes: 0,
        difficulty: 'Easy',
        description: '',
        image: null
    });
    
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState(['']);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Mock function to simulate ingredient search - replace with actual API call
    const searchIngredients = async (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }
        
        // Mock data - replace with actual API call
        const mockIngredients = [
            { _id: '1', name: 'Chicken Breast', category: 'Meat' },
            { _id: '2', name: 'Tomatoes', category: 'Vegetable' },
            { _id: '3', name: 'Onions', category: 'Vegetable' },
            { _id: '4', name: 'Garlic', category: 'Vegetable' },
            { _id: '5', name: 'Olive Oil', category: 'Other' }
        ];
        
        const filtered = mockIngredients.filter(ingredient => 
            ingredient.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filtered);
        setShowSearchResults(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
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

    const handleSubmit = () => {
        // Prepare data for submission
        const recipeData = {
            name: formData.name,
            cookTime: parseInt(formData.hours) * 60 + parseInt(formData.minutes), // Convert to minutes
            difficulty: formData.difficulty,
            ingredientNo: ingredients.length,
            description: formData.description,
            ingredients: ingredients.map(ing => ({
                ingredient: ing.ingredient._id,
                quantity: parseFloat(ing.quantity),
                measurementType: ing.measurementType
            })),
            instructions: instructions.filter(instruction => instruction.trim() !== '')
        };
        
        console.log('Recipe data to submit:', recipeData);
        // Here you would make the API call to save the recipe
        // navigate("/recipes");
    };

    return (
        <div className="w-full h-full min-h-screen max-h-screen">
            {/* Header matching the recipes page style */}
            <div className="w-full h-16 relative flex !pt-5">
                <h2 className="title font-semibold text-4xl">Add Recipe</h2>
                <button 
                    onClick={() => navigate("/recipes")} 
                    className="absolute right-0 h-3/4 !pr-4 !pl-4 rounded-full border-[#A6C78A] border-2 hover:bg-[#A6C78A] transform"
                >
                    Back
                </button>
            </div>
            <br/>

            {/* Main form container */}
            <div className="w-full min-h-21/24 max-h-21/24 overflow-scroll !pr-4">
                    <div className="w-full flex !mb-8">
                        {/* Image Upload */}
                        <div className="bg-[#D5FAB8] rounded-lg !p-4 w-1/4 !mr-8">
                            <h3 className="font-semibold text-lg !mb-4">Recipe Image</h3>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-square border-2 border-dashed border-[#A6C78A] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#E5F3DA] transition-colors"
                            >
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <>
                                        {/* Replace with your custom upload icon component */}
                                        <img src={uploadImg} className="w-6 h-6 !mb-4"/> 
                                        <p className="font-medium">Click to upload an image</p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                required
                            />
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
                                    className="w-full !px-3 !py-2 border-2 border-[#A6C78A] rounded-full focus:outline-none"
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
                                    className="w-full !px-3 !py-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none resize-none"
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
                                {/* Replace with your custom plus icon component */}
                                {/* <PlusIcon className="h-4 w-4" /> */}
                                <span className="text-lg font-bold">+</span>
                                <span className="font-medium">Add Step</span>
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
                                        className={`flex-1 !px-3 !py-2 border-2 border-[#A6C78A] focus:outline-none resize-none ${instructions.length == 1 ? 'rounded-r-lg' : ''}`}
                                        placeholder={`Step ${index + 1} instructions...`}
                                        rows="2"
                                    />
                                    {instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(index)}
                                            className="flex-shrink-0 text-white bg-[#A6C78A] hover:text-[#CF7171] h-17 w-8 rounded-r-lg font-bold"
                                        >
                                            {/* Replace with your custom X/close icon component */}
                                            {/* <XIcon className="h-5 w-5" /> */}
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
                                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#A6C78A] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {searchResults.map((ingredient) => (
                                        <div
                                            key={ingredient._id}
                                            onClick={() => addIngredient(ingredient)}
                                            className="!px-4 !py-2 hover:bg-[#E5F3DA] cursor-pointer flex justify-between items-center border-b-2 border-[#A6C78A] last:border-b-0"
                                        >
                                            <span className="font-medium">{ingredient.name}</span>
                                            <span className="text-sm bg-[#A6C78A] !px-2 !py-1 rounded">
                                                {ingredient.category}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Added Ingredients */}
                        <div className="space-y-2">
                            {ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="flex items-center space-x-3 !py-1 !px-4 bg-white !mb-1 rounded-lg">
                                    <span className="flex-1 font-medium">{ingredient.ingredient.name}</span>
                                    <input
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => updateIngredientQuantity(ingredient.id, e.target.value)}
                                        placeholder="Qty"
                                        className="w-20 !px-2 !py-1 border-2 border-[#A6C78A] rounded focus:outline-none"
                                    />
                                    <select
                                        value={ingredient.measurementType}
                                        onChange={(e) => updateIngredientMeasurement(ingredient.id, e.target.value)}
                                        className="!px-2 !py-1 border-2 border-[#A6C78A] rounded focus:outline-none"
                                    >
                                        <option value="grams">grams</option>
                                        <option value="ml">ml</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(ingredient.id)}
                                        className="text-red-600 hover:text-red-800 font-bold"
                                    >
                                        {/* Replace with your custom X/close icon component */}
                                        {/* <XIcon className="h-5 w-5" /> */}
                                        <span className="text-xl">×</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>

                    

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 !mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/recipes")}
                            className="!px-6 !py-2 border-2 border-[#A6C78A] rounded-lg hover:bg-[#A6C78A] transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="!px-6 !py-2 bg-[#A6C78A] rounded-lg hover:bg-[#95B574] transition-colors font-medium"
                        >
                            Save Recipe
                        </button>
                    </div>
            </div>
        </div>
    );
}