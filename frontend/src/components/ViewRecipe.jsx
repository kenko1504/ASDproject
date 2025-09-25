import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import trashImg from "../assets/trash-alt-svgrepo-com.svg";
import editImg from "../assets/edit-svgrepo-com.svg";
import NutritionPopupModal from "./NutritionPopupModal.jsx";
import checkImg from "../assets/circle-check-svgrepo-com.svg";
import crossImg from "../assets/circle-xmark-svgrepo-com.svg";

export default function ViewRecipe() {
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const { user } = useContext(AuthContext);

    // Recipe state
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setSaved] = useState(false);
    const [showNutritionModal, setShowNutritionModal] = useState(false);

    // Format cook time from minutes to HH:MM
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // Calculate dynamic font size based on name length
    const getDynamicFontSize = (name) => {
        if (!name) return 'text-4xl';
        const length = name.length;
        if (length <= 20) return 'text-4xl';
        if (length <= 30) return 'text-3xl';
        if (length <= 40) return 'text-2xl';
        if (length <= 60) return 'text-xl';
        return 'text-lg';
    };


    // Check if recipe is saved by current user
    const checkIfRecipeSaved = async () => {
        if (!user?._id || !recipeId) return;

        try {
            const response = await fetch(`http://localhost:5000/users/${user._id}/saved-recipes`);
            const savedRecipes = await response.json();

            const isRecipeSaved = savedRecipes.some(savedRecipe => savedRecipe._id === recipeId);
            setSaved(isRecipeSaved);
        } catch (error) {
            console.error('Error checking saved recipes:', error);
        }
    };

    // Handle save/unsave recipe
    const handleSaving = async () => {
        if (!user?._id || !recipeId) {
            console.error('Missing user ID or recipe ID:', { userId: user?._id, recipeId });
            return;
        }

        try {
            if (isSaved) {
                // Remove from saved recipes
                const response = await fetch(`http://localhost:5000/users/${user._id}/saved-recipes`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ recipeId: recipeId })
                });

                if (response.ok) {
                    setSaved(false);
                    console.log('Recipe removed from saved recipes');
                } else {
                    const errorData = await response.text();
                    console.error('Failed to remove recipe from saved recipes:', response.status, errorData);
                }
            } else {
                // Add to saved recipes
                const response = await fetch(`http://localhost:5000/users/${user._id}/saved-recipes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ recipeId: recipeId })
                });

                if (response.ok) {
                    setSaved(true);
                    console.log('Recipe added to saved recipes');
                } else {
                    const errorData = await response.text();
                    console.error('Failed to add recipe to saved recipes:', response.status, errorData);
                }
            }
        } catch (error) {
            console.error('Error saving/unsaving recipe:', error);
        }
    };

    // Handle delete recipe
    const handleDeleteRecipe = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/recipes/${recipeId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('Recipe deleted successfully');
                alert('Recipe deleted successfully!');
                navigate("/recipes");
            } else {
                console.error('Failed to delete recipe');
                alert('Failed to delete recipe. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Error deleting recipe. Please try again.');
        }
    };

    // Fetch recipe details
    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/recipes/${recipeId}`);

            if (response.ok) {
                const data = await response.json();
                setRecipe(data);
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
            checkIfRecipeSaved();
        }
    }, [recipeId, user?._id]);

    if (loading) {
        return (
            <div className="w-full h-full min-h-screen max-h-screen flex items-center justify-center">
                <p className="text-lg bg-[#E5F3DA] border-[#A6C78A] border-3 border-dashed rounded-lg !px-8 !py-4">Loading recipe...</p>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="w-full h-full min-h-screen max-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-600">{error || 'Recipe not found'}</p>
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
            {/* Header */}
            <div className="w-full h-16 relative flex !pt-5 items-center">

                <button onClick={handleSaving} className="w-10 h-10 !mr-4 flex-shrink-0">
                    <svg className={`${isSaved ? 'fill-[#EEDA45]' : 'fill-transparent'} w-10 h-10 transform transition active:scale-90 hover:scale-110`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z"
                            stroke="#EEDA45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                    </svg>
                </button>
                
                <h2 className={`title font-semibold ${getDynamicFontSize(recipe.name)} overflow-hidden break-all max-w-2/3 max-h-12 flex-1 mr-4`}>{recipe.name}</h2>

                {user?.role === "admin" && (
                    <>
                        <button
                            onClick={handleDeleteRecipe}
                            className="absolute right-36 h-3/4 w-12 rounded-full transform !mr-4 flex items-center justify-center hover:scale-110 transition active:scale-90"
                        >
                            <img className="w-10 h-10" src={trashImg} alt="Delete"/>
                        </button>
                        <button
                            onClick={() => navigate(`/editRecipe/${recipeId}`)}
                            className="absolute right-20 h-3/4 !pr-4 !pl-4 rounded-full transform !mr-4 hover:scale-110 transition active:scale-90"
                        >
                            <img className="w-10 h-10" src={editImg} alt="Delete"/>
                        </button>
                    </>
                )}

                <button className="absolute right-0 h-3/4 !pr-4 !pl-4 rounded-full border-[#A6C78A] border-2 hover:bg-[#A6C78A] transition"
                    onClick={() => navigate("/recipes")}>Back</button>
            </div>
            <br/>

            <div className="w-full min-h-10/12 max-h-10/12 overflow-scroll">
                <div className="w-full flex !mb-8">
                    {/* Recipe Image */}
                    <div className="bg-[#D5FAB8] rounded-lg h-fit !p-4 w-1/4 !mr-8">
                        <div className="w-full aspect-square border-2 border-[#A6C78A] rounded-lg">
                            {recipe.image ? (
                                <img src={recipe.image} alt={recipe.name}
                                    className="w-full h-full object-cover rounded-lg"/>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-[#E5F3DA]">
                                    <p className="font-medium text-gray-600">No image available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recipe Details */}
                    <div className="bg-[#D5FAB8] rounded-lg !p-4 w-3/4">
                        <h3 className="font-semibold text-lg !mb-4">Recipe Details</h3>

                        {/* Recipe Name */}
                        <div className="!mb-4">
                            <label className="block font-medium !mb-2">Recipe Name</label>
                            <div className="w-full !px-3 !py-2 border-2 border-[#A6C78A] rounded-full bg-white">
                                {recipe.name}
                            </div>
                        </div>

                        {/* Cook Time and Difficulty */}
                        <div className="flex space-x-4 !mb-4">
                            <div className="flex-1">
                                <label className="block font-medium !mb-2">Cook Time</label>
                                <div className="!px-3 !py-2 border-2 w-fit border-[#A6C78A] rounded-lg bg-white">
                                    {formatTime(recipe.cookTime)}
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block font-medium !mb-2">Difficulty</label>
                                <div className="!px-3 !py-2 border-2 w-fit border-[#A6C78A] rounded-lg bg-white">
                                    {recipe.difficulty}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-medium !mb-2">Description</label>
                            <div className="w-full !px-3 !py-2 border-2 border-[#A6C78A] rounded-lg bg-white min-h-[80px] break-words overflow-scroll">
                                <div className="break-all overflow-wrap-anywhere">
                                    {recipe.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-fit flex">
                    {/* Instructions */}
                    <div className="bg-[#D5FAB8] rounded-lg !p-4 w-1/2 !mr-8 h-fit">
                        <h3 className="font-semibold text-lg !mb-4">Instructions</h3>

                        <div className="space-y-3">
                            {recipe.instructions && recipe.instructions.map((instruction, index) => (
                                <div key={index} className="flex max-h-30 items-stretch space-x-3 !mb-2">
                                    <div className="w-8 bg-[#A6C78A] text-white rounded-l-lg flex items-center justify-center font-semibold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 !px-3 !py-2 border-2 border-[#A6C78A] bg-white rounded-r-lg min-h-[60px] flex items-center break-all overflow-auto">
                                        {instruction}
                                    </div>
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

                        {/* Ingredients List */}
                        <div className="space-y-2">
                            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center h-10 border-[#A6C78A] bg-white border-2 !mb-2 rounded-lg">
                                    <div className=" h-full w-1/24 flex items-center justify-center"><img src={checkImg} className="w-6 h-6 flex items-center justify-center"/></div>
                                    {/* Need to add cross for missing ingredients */}
                                    <span className="flex-1 font-medium">
                                        {ingredient.ingredient?.foodName || ingredient.ingredient?.name || 'Unknown ingredient'}
                                    </span>
                                    <div className="w-1/6 border-x-2 !px-2 border-[#A6C78A] h-full flex items-center justify-center">
                                        {ingredient.quantity}
                                    </div>
                                    <div className="w-1/6 !px-2 h-full flex items-center justify-center">
                                        {ingredient.measurementType}
                                    </div>
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
                ingredients={recipe?.ingredients || []}
            />
        </div>
    );
}