import {useState} from "react";
import AddIngredientPopUp from "./AddIngredientPopUp";
export default function AddButton() {
  const [showButtons, setShowButtons] = useState(false);
  //shows add ingredient pop up
  const [showAIPopup, setShowAIPopup] = useState(false);
  const handleMainButtonClick = () => {
    setShowButtons(!showButtons);
  };
  const handleAddIngredientClose = () => {
    setShowAIPopup(false);
  };
  const handleAddIngredientOpen = () => {
    setShowAIPopup(true);
  };
  return (
    <>
      {showAIPopup && <AddIngredientPopUp onClose={handleAddIngredientClose} />}

      {showButtons && 
      <>
        <button className="fixed bottom-24 right-9.5 w-9 h-9 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-2xl">?</button>
        <button onClick={handleAddIngredientOpen} className="fixed bottom-35 right-9.5 w-9 h-9 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-2xl">?</button>
      </>
      }
      <button onClick={handleMainButtonClick} className="fixed bottom-6 right-6 w-16 h-16 bg-[#3DC581] text-white rounded-full shadow-lg flex items-start justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-6xl">
         <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-6xl">+</span>
      </button>
    </>
  )
}
