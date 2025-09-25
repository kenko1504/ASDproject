import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import RecipeCard from "./RecipeCard.jsx";
import searchImg from "../assets/search-svgrepo-com.svg";
import filterImg from "../assets/filter-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";


export default function Recipes() {
  const { user } = useContext(AuthContext);

  const [isSavedTab, setTab] = useState(false);
  const [isFilterOpen, setFilter] = useState(false);
  const [cookTime, setCookTime] = useState(1439);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');

  // Recipe search state
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);

  const navigate = useNavigate();

  const handleTab = (tab) => {
    setTab(tab);
  }

  const toggleFilter = () => {
    setFilter(!isFilterOpen);
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  
  const handleCookTimeChange = (e) => {
    setCookTime(parseInt(e.target.value));
  }

  const toggleDifficulty = (difficulty) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(difficulty)) {
        // Remove difficulty if already selected
        return prev.filter(d => d !== difficulty);
      } else {
        // Add difficulty if not selected
        return [...prev, difficulty];
      }
    });
  }

  const handleSortSelect = (event) => {
    setSelectedSort(event.target.value);
  }

  // Fetch all recipes from backend
  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:5000/recipes");
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
      setFilteredRecipes([]);
    }
  };

  // Fetch saved recipes for current user
  const fetchSavedRecipes = async () => {
    if (!user?._id) {
      setSavedRecipes([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${user._id}/saved-recipes`);
      if (response.ok) {
        const data = await response.json();
        setSavedRecipes(data);
      } else {
        console.error('Error fetching saved recipes:', response.status);
        setSavedRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setSavedRecipes([]);
    }
  };

  // Filter recipes based on search term and filters
  const filterRecipes = () => {
    // Start with either all recipes or saved recipes based on tab
    let filtered = isSavedTab ? savedRecipes : recipes;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(recipe =>
        selectedDifficulties.includes(recipe.difficulty)
      );
    }

    // Filter by cook time
    filtered = filtered.filter(recipe => recipe.cookTime <= cookTime);

    // Sort the filtered results
    if (selectedSort === 'TD') {
      // Time Decreasing (highest cook time first)
      filtered.sort((a, b) => b.cookTime - a.cookTime);
    } else if (selectedSort === 'TI') {
      // Time Increasing (lowest cook time first)
      filtered.sort((a, b) => a.cookTime - b.cookTime);
    }
    // For "Recent" (empty value) or "M" (Missing Ingredients), keep original order

    setFilteredRecipes(filtered);
  };

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fetch saved recipes when saved tab is selected or user changes
  useEffect(() => {
    if (isSavedTab) {
      fetchSavedRecipes();
    }
  }, [isSavedTab, user?._id]);

  // Filter recipes when search term or filters change
  useEffect(() => {
    filterRecipes();
  }, [searchTerm, selectedDifficulties, cookTime, selectedSort, recipes, savedRecipes, isSavedTab]);

  // Handle recipe deletion callback
  const handleRecipeDeleted = (deletedRecipeId) => {
    setRecipes(prev => prev.filter(recipe => recipe._id !== deletedRecipeId));
    setSavedRecipes(prev => prev.filter(recipe => recipe._id !== deletedRecipeId));
  };

  // Handle recipe save/unsave callback
  const handleRecipeSaveChange = () => {
    if (isSavedTab) {
      fetchSavedRecipes();
    }
  };


  return (
    <div className="w-full h-full min-h-screen max-h-screen">
      <div className="w-full relative flex !pt-5">
        <h2 className="title font-semibold text-4xl">Recipes</h2> 
        { user.role == "admin" ? (
          <button onClick={() => navigate("/addRecipe")} className="absolute right-0 h-3/4 !pr-4 !pl-4 rounded-full border-[#A6C78A] border-2 hover:bg-[#A6C78A] transform">Add Recipe</button>
        ) : null}
      </div>
      <br/>
      {/* Your recipes content here */}

      {/* Top search options */}
      <div className="flex h-1/24 w-full !mb-4">
        <div className="w-1/6 h-full rounded-lg bg-[#D5FAB8] !p-1 flex relative">
          <div 
            className={`absolute top-1 bottom-1 bg-[#A6C78A] rounded-lg transition-all duration-300 ease-in-out ${
              isSavedTab ? 'left-1/2 right-1' : 'left-1 right-1/2'}`}/>
  
          <button onClick={() => handleTab(false)}
            className={`w-1/2 h-full rounded-lg !mr-1 transition-all duration-50 relative z-10 border-dashed border-[#A6C78A]
            ${ isSavedTab ? 'hover:border-3' : 'border-3'}`}>All</button>
          <button onClick={() => handleTab(true)}
            className={`w-1/2 h-full rounded-lg transition-all duration-50 relative z-10 border-dashed border-[#A6C78A]
            ${ !isSavedTab ? 'hover:border-3' : 'border-3'}`}>Saved</button>
        </div>

        <div className="border-2 border-[#A6C78A] rounded-full w-4/6 !pl-4 !pr-4 !ml-4 !mr-4 focus:outline-1 outline-[#A6C78A] flex items-center">
          <img src={searchImg} className=" w-6 h-6 !mr-2"/>
          <input
            className="h-full w-full outline-0"
            type="search"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-1/6 h-full flex items-center justify-center">
          <button 
          onClick={toggleFilter}
          className={`w-full h-full border-2 rounded-full border-[#A6C78A] transition flex items-center justify-center transform active:scale-95
          ${ isFilterOpen ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
            <img src={filterImg} className="w-6 h-6 !mr-2"/>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* filter and sort options */}
      <div className="flex w-full !pl-8 !mb-2">
        <div className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${
          isFilterOpen ? 'h-14 opacity-100' : 'h-0 opacity-0'
        }`}>
          <div className="flex justify-center h-14">
            <div className="flex bg-[#D5FAB8] rounded-lg justify-center items-center w-1/3 !mr-8">
              <label className="!mr-4">Max Time</label>
              <input
                type="range"
                min="10"
                max="1439"
                value={cookTime}
                onChange={handleCookTimeChange}
                className="!mr-4 w-5/12"
              />
              <label className="max-w-1/12 min-w-1/12">{formatTime(cookTime)}</label>
            </div>
      
            <div className="flex bg-[#D5FAB8] rounded-lg justify-center !pr-4 !pl-4 items-center w-1/3 !mr-8">
              <label className="!mr-4">Difficulty</label>
              <button
               onClick={() => toggleDifficulty('Easy')}
                className={`w-1/4 border-2 border-r-0 rounded-l-lg border-[#A6C78A] transition h-2/3
                  ${selectedDifficulties.includes('Easy') ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
                Easy
              </button>
              <button
                onClick={() => toggleDifficulty('Medium')}
                className={`w-1/4 border-2 border-r-0 border-l-0 border-[#A6C78A] transition h-2/3
                  ${selectedDifficulties.includes('Medium') ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
                Medium
              </button>
              <button
                onClick={() => toggleDifficulty('Hard')}
                className={`w-1/4 border-2 border-l-0 rounded-r-lg border-[#A6C78A] transition h-2/3
                  ${selectedDifficulties.includes('Hard') ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
                Hard
              </button>
            </div>
      
            <div className="flex bg-[#D5FAB8] rounded-lg items-center w-1/6 relative !mr-8 !pl-4 !pr-4">
              <label className="!mr-4">Sort</label>
              <select 
                onChange={handleSortSelect} 
                value={selectedSort}
                className="w-full !pl-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none h-2/3">
                <option value="">Recent</option>
                <option value="M">Missing Ingredients</option>
                <option value="TD">Time Decreasing</option>
                <option value="TI">Time Increasing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe List */}

      <div className="w-full max-h-9/12 flex flex-wrap overflow-scroll justify-center">
        {filteredRecipes.length === 0 ? (
          <div className="w-full flex justify-center !mt-8">
            <p className="text-lg !px-4 !py-2 rounded-lg bg-[#E5F3DA] border-[#A6C78A] border-3 border-dashed w-fit">
              No recipes match your search criteria.
            </p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onRecipeDeleted={handleRecipeDeleted}
              onRecipeSaveChange={handleRecipeSaveChange}
            />
          ))
        )}
      </div>

    </div>
  );
}
