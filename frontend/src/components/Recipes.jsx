import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import RecipeCard from "./RecipeCard.jsx";
import searchImg from "../assets/search-svgrepo-com.svg";
import filterImg from "../assets/filter-svgrepo-com.svg";


export default function Recipes() {
  const { user } = useContext(AuthContext);

  const [isSavedTab, setTab] = useState(false);
  const [isFilterOpen, setFilter] = useState(false);
  const [cookTime, setCookTime] = useState(120);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

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

  const handleCuisineSelect = (event) => {
    setSelectedCuisine(event.target.value);
  }

  const handleSortSelect = (event) => {
    setSelectedSort(event.target.value);
  }


  return (
    <div className="w-full h-full min-h-screen max-h-screen">
      <div className="w-full relative flex !pt-5">
        <h2 className="title font-semibold text-4xl">Recipes</h2> 
        { user.role == "admin" ? (
          <button className="absolute right-0 h-3/4 !pr-4 !pl-4 rounded-full border-[#A6C78A] border-2 hover:bg-[#A6C78A] transform">Add Recipe</button>
        ) : null}
      </div>
      <br/>
      {/* Your recipes content here */}

      {/* Top search options */}
      <div className="flex h-1/24 w-full !mb-8">
        <div className="w-1/6 h-full rounded-lg bg-[#D5FAB8] !p-1 flex">
          <button  
          onClick={() => handleTab(false)}
          className={`w-1/2 h-full rounded-lg border-dashed border-[#A6C78A] !mr-1 transition 
            ${ !isSavedTab ? 'bg-[#A6C78A]' : 'hover:border-3' }`}>
            All
          </button>

          <button 
          onClick={() => handleTab(true)}
          className={`w-1/2 h-full rounded-lg border-dashed border-[#A6C78A] transition 
            ${ isSavedTab ? 'bg-[#A6C78A]' : 'hover:border-3' }`}>
            Saved
          </button>           
        </div>

        <div className="border-2 border-[#A6C78A] rounded-full w-4/6 !pl-4 !pr-4 !ml-4 !mr-4 focus:outline-1 outline-[#A6C78A] flex items-center">
          <img src={searchImg} className=" w-6 h-6 !mr-2"/>
          <input className="h-full w-full outline-0"  type="search"  placeholder="Search"></input>
        </div>

        <div className="w-1/6 h-full flex items-center justify-center">
          <button 
          onClick={toggleFilter}
          className={`w-full h-full border-2 rounded-full border-[#A6C78A] transition flex items-center justify-center active:w-23/24 active:h-23/24
          ${ isFilterOpen ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
            <img src={filterImg} className="w-6 h-6 !mr-2"/>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* filter and sort options */}
      <div className=" flex w-full !pl-8">
        { isFilterOpen ? (
          <div className="h-14 w-full flex">
            <div className="flex bg-[#D5FAB8] rounded-lg justify-center items-center w-1/4 !mr-8">
              <label className="!mr-4">Max Cook Time</label>
              <input
                type="range"
                min="10"
                max="1440"
                value={cookTime}
                onChange={handleCookTimeChange}
                className="!mr-4 w-5/12"
              />
              <label className="max-w-1/12 min-w-1/12">{formatTime(cookTime)}</label>
            </div>

            <div className="flex bg-[#D5FAB8] rounded-lg justify-center !pr-4 !pl-4 items-center w-1/4 !mr-8">
              <label className="!mr-4">Difficulty</label>
              <button 
                onClick={() => toggleDifficulty('easy')}
                className={`w-1/4 border-2 border-r-0 rounded-l-lg border-[#A6C78A] transition h-2/3
                  ${selectedDifficulties.includes('easy') ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
                Easy
              </button>
              <button 
                onClick={() => toggleDifficulty('medium')}
                className={`w-1/4 border-2 border-r-0 border-l-0 border-[#A6C78A] transition h-2/3
                  ${selectedDifficulties.includes('medium') ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
                Medium
              </button>
              <button 
                onClick={() => toggleDifficulty('hard')}
                className={`w-1/4 border-2 border-l-0 rounded-r-lg border-[#A6C78A] transition h-2/3
                  ${selectedDifficulties.includes('hard') ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
                Hard
              </button>
            </div>
            
            <div className="flex bg-[#D5FAB8] rounded-lg items-center w-1/4 relative !mr-8 !pl-4 !pr-4">
              <label className="!mr-4">Cuisine</label>
              <select 
              onChange={handleCuisineSelect} value={selectedCuisine}
              className="w-full !pl-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none h-2/3">
                  <option value="">All Cuisines</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="chinese">Chinese</option>
                  <option value="indian">Indian</option>
                  <option value="japanese">Japanese</option>
                  <option value="french">French</option>
                  <option value="thai">Thai</option>
                  <option value="american">American</option>
                </select>
            </div>

            <div className="flex bg-[#D5FAB8] rounded-lg items-center w-1/6 relative !mr-8 !pl-4 !pr-4">
              <label className="!mr-4">Sort</label>
              <select 
              onChange={handleSortSelect} value={selectedSort}
              className="w-full !pl-2 border-2 border-[#A6C78A] rounded-lg focus:outline-none h-2/3">
                  <option value="">Recent</option>
                  <option value="M">Missing Ingredients</option>
                  <option value="C">Cuisine</option>
                  <option value="TD">Time Decreasing</option>
                  <option value="TD">Time Increasing</option>
                </select>
            </div>

          </div>
        ) : null}
      </div>

      {/* Recipe List */}

      <div className="w-full min-h-9/12 max-h-9/12 flex flex-wrap overflow-scroll">
        <RecipeCard/>
        <RecipeCard/>
        <RecipeCard/>
        <RecipeCard/>
        <RecipeCard/>
        <RecipeCard/>
        <RecipeCard/>
        <RecipeCard/>
        <RecipeCard/>
      </div>

    </div>
  );
}
