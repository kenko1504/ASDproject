import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, getUserRoleFromToken } from "../contexts/AuthContext.jsx";;
import { API_BASE_URL, authenticatedFetch } from "../utils/api.js";
import crossImg from "../assets/circle-xmark-svgrepo-com.svg";
import checkImg from "../assets/circle-check-svgrepo-com.svg";
import clockImg from "../assets/clock-svgrepo-com.svg";
import trashImg from "../assets/trash-alt-svgrepo-com.svg";


export default function MealCard({ Meal, onMealDeleted, isDashboard = false }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [missingIng, setMissingIng] = useState(0);
    const [recipeImg, setRecipeImg] = useState(null);

    // Format cook time from minutes to HH:MM
    const formatCookTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const getRecipeImage = async(recipeId) => {
        try {
            const response = await authenticatedFetch(`http://${API_BASE_URL}/recipes/${recipeId}`, {
                method: 'GET'
            });
            if (response.ok) {
                const recipe = await response.json();
                return recipe.image;
            }
        } catch (error) {
            console.error('Error fetching recipe image:', error);
        }
        return null;
    };

    // Handle delete meal
    const handleDeleteMeal = async (e) => {
        e.stopPropagation();

        const confirmDelete = window.confirm("Are you sure you want to delete this meal?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://${API_BASE_URL}/meal/${Meal._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('Meal deleted successfully');
                // Call the callback to refresh the meal list
                if (onMealDeleted) {
                    onMealDeleted(Meal._id);
                }
            } else {
                console.error('Failed to delete meal');
                alert('Failed to delete meal. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting meal:', error);
            alert('Error deleting meal. Please try again.');
        }
    };

    // get Recipe Image
    useEffect(() => {
        getRecipeImage(Meal.recipeId).then(img => setRecipeImg(img));
    }, [user?._id, Meal?._id]);

    return (
        <div
            role="button"
            onClick={() => {
                if (Meal?.recipeId) {
                    navigate(`/recipe/${Meal.recipeId}`);
                }
            }}
            className={`${isDashboard ? '!m-2 aspect-square h-full' : '!m-8 aspect-square w-3/5'} rounded-lg hover:shadow-lg transition-all relative cursor-pointer transform hover:scale-105 bg-cover bg-center`}
            style={{
                backgroundImage: recipeImg ? `url(${recipeImg})` : 'none',
                backgroundColor: recipeImg ? 'transparent' : '#E5F3DA'
            }}
        >
            <button onClick={handleDeleteMeal} className="w-8 h-8 absolute top-2 left-2 z-10 rounded-full hover:text-white transition">
                    <img className="w-8 h-8 absolute top-0 transform transition active:scale-90 hover:scale-110" src={trashImg}/>
            </button>

            <div className="absolute bottom-4 left-2 drop-shadow-lg backdrop-blur-sm bg-white/25 rounded-full flex">
                { missingIng == 0 ? (
                    <img className="w-6 h-6" src={checkImg}/>
                ) : (
                    <>
                        <img className="w-6 h-6 !mr-1" src={crossImg}/>
                        <span className="font-semibold !mr-2">{missingIng}</span>                        
                    </>
                )}
                
            </div>
            <div className="absolute bottom-4 right-2 drop-shadow-lg backdrop-blur-sm bg-white/25 rounded-full flex">
                <img className="w-6 h-6 !mr-1" src={clockImg}/>
            </div>
        </div>
    );

}



