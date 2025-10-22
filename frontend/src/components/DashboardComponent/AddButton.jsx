import { useState } from "react";
import AutoIngredientPopUp from "./AutoIngredientPopUp";
import ManualIngredientPopUp from "./ManualIngredientPopUp";
import ManualIcon from "../../assets/ManualUpload.svg";
import AutoIcon from "../../assets/AutoUpload.png";

export default function AddButton() {
  const [showButtons, setShowButtons] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [showManualPopup, setShowManualPopup] = useState(false);

  const handleAutoClose = () => setShowAIPopup(false);
  const handleAutoOpen = () => {
    setShowAIPopup(true);
    setShowManualPopup(false); // hide manual popup
  };

  const handleManualClose = () => setShowManualPopup(false);
  const handleManualOpen = () => {
    setShowManualPopup(true);
    setShowAIPopup(false); // hide AI popup
  };

  return (
    <>
      {showAIPopup && <AutoIngredientPopUp onClose={handleAutoClose} />}
      {showManualPopup && <ManualIngredientPopUp onClose={handleManualClose} />}

      <div
        className="fixed bottom-6 right-6 flex flex-col gap-3 z-[9999]"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        {/* Animated buttons */}
        <div
          className={`
            flex flex-col items-center gap-2
            transition-all duration-300 ease-out
            ${showButtons ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
          `}
        >
          <button
            onClick={handleManualOpen}
            className="w-10 h-10 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors"
          >
            <img src={ManualIcon} alt="Manual" className="w-6 h-6" />
          </button>

          <button
            onClick={handleAutoOpen}
            className="w-10 h-10 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors"
          >
            <img src={AutoIcon} alt="Auto" className="w-6 h-6" />
          </button>
        </div>

        {/* Main + button */}
        <button className="w-16 h-16 bg-[#3DC581] text-white rounded-full shadow-lg flex items-center justify-center text-6xl relative">
          <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-6xl">+</span>
        </button>
      </div>
    </>
  );
}
