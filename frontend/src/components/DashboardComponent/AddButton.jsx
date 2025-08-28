import {useState} from "react";
export default function AddButton() {
  const [showButtons, setShowButtons] = useState(false);

  const handleMainButtonClick = () => {
    setShowButtons(!showButtons);
  };
  return (
    <>
      {showButtons && 
      <>
        <button className="fixed bottom-24 right-10 w-8 h-8 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-2xl">?</button>
        <button className="fixed bottom-34 right-10 w-8 h-8 bg-[#36874D] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-2xl">?</button>
      </>
      }
      <button onClick={handleMainButtonClick} className="fixed bottom-6 right-6 w-16 h-16 bg-[#3DC581] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors text-2xl">
        +
      </button>
    </>
  )
}
