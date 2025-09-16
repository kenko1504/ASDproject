import { useState } from "react";


export default function Recipes() {

  const [isSavedTab, setTab] = useState(false);
  const [isFilterOpen, setFilter] = useState(false);
  const [cookTime, setCookTime] = useState(120);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');

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
    const newValue = event.target.value;
    setSelectedCuisine(newValue);
  }

  return (
    <div className="w-full">
      <h2 className="!pt-5 title font-semibold text-4xl">Recipes</h2> <br/>
      {/* Your recipes content here */}

      {/* Top search options */}
      <div className="flex h-1/24 w-full !mb-4 text-1">
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

        <input type="search" className="border-2 border-[#A6C78A] rounded-full w-4/6 !pl-4 !pr-4 !ml-4 !mr-4 focus:outline-1 outline-[#A6C78A]" placeholder="Search"></input>

        <div className="w-1/6 h-full flex">
          <button 
          onClick={toggleFilter}
          className={`w-full h-full border-4 rounded-full border-[#A6C78A] transition
          ${ isFilterOpen ? 'bg-[#A6C78A]' : 'hover:bg-[#A6C78A]'}`}>
            Filter
          </button>
        </div>
      </div>

      {/* filter and sort options */}
      <div className="!mb-4 !pl-4 !pr-4 h-1/18 flex w-full">
        { isFilterOpen ? (
          <>
            <div className="flex bg-[#D5FAB8] rounded-lg justify-center items-center w-1/3 !mr-8">
              <label className="!mr-4">Max Cook Time</label>
              <input
                type="range"
                min="10"
                max="1440"
                value={cookTime}
                onChange={handleCookTimeChange}
                className="!mr-4 w-1/2"
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

            <button className="flex border-4 border-[#A6C78A] hover:bg-[#A6C78A] rounded-full !pr-8 !pl-8 items-center !p-4 transition">Apply</button>
          </>
        ) : null}
      </div>

      {/* <hr className="!ml-8 !mr-8 border-[#A6C78A] border-1"></hr> */}

    </div>
  );
}
