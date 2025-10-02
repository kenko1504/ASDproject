import {useState} from "react";
import AutoIngredientPopUp from "./AutoIngredientPopUp";
import ManualIngredientPopUp from "./ManualIngredientPopUp";
import ManualIcon from "../../assets/ManualUpload.svg"
import AutoIcon from "../../assets/AutoUpload.png"


export default function AddButton() {
  const [showButtons, setShowButtons] = useState(false);
  //shows add ingredient pop up
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [showManualPopup, setShowManualPopup] = useState(false)

  const handleMainButtonClick = () => {
    setShowButtons(!showButtons);
  };
  const handleAutoClose = () => {
    setShowAIPopup(false);
  };
  const handleAutoOpen = () => {
    setShowAIPopup(true);
  };
  const handleManualClose = () => {
    setShowManualPopup(false);
  };
  const handleManualOpen = () => {
    setShowManualPopup(true);
  };

  return (
    <>
      {showAIPopup && <AutoIngredientPopUp onClose={handleAutoClose} />}
      {showManualPopup && <ManualIngredientPopUp onClose={handleManualClose} /> }
      {showButtons && 
      <>
        <button onClick={handleManualOpen} className="fixed bottom-24 right-9.5 w-10 h-10 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-2xl"><img src={AutoIcon} alt="iconAuto" className="w-6 h-6"/></button>
        <button onClick={handleAutoOpen} className="fixed bottom-35 right-9.5 w-10 h-10 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-2xl"><img src={ManualIcon} alt="iconManual" className="w-6 h-6"/></button>
      </>
      }
      <button onClick={handleMainButtonClick} className="fixed bottom-6 right-6 w-16 h-16 bg-[#3DC581] text-white rounded-full shadow-lg flex items-start justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-6xl">
         <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-6xl">+</span>
      </button>
    </>
  )
}
