import { Link } from "react-router-dom";
import { useRef, useEffect, useState, use } from "react";
import SearchIcon from "../assets/grocerySearchIcon.svg";
import MilkImage from "../assets/dummyIngredients/milk.jpg";
import EggImage from "../assets/dummyIngredients/egg.jpg";
import ChickenBreastImage from "../assets/dummyIngredients/chickenBreast.webp";
import BroccoliImage from "../assets/dummyIngredients/broccoli.jpg";
import Butter from "../assets/dummyIngredients/butter.webp";
import FrozenPeas from "../assets/dummyIngredients/peas.jpg";
import Carrots from "../assets/dummyIngredients/carrots.jpg";

import { API_BASE_URL } from '../utils/api.js';
export default function FridgeList() {

  const [fetchedIngredients, setFetchedIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/ingredients`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
        const data = await res.json();
        console.log("Fetched ingredients:", data);
        setFetchedIngredients(data);
        console.log("fetchIngredients array:", fetchedIngredients);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  // For search functionality
  const [query, setQuery] = useState("");
  
  const filtered = fetchedIngredients.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  console.log("Filtered ingredients:", filtered);
  const containerRef = useRef(null);
  const scrollRef = useRef({ value: 0 });

  // Smooth animation
  useEffect(() => {
    const scroll = () => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += scrollRef.current.value;
      }
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  }, []);

  // Scroll speed proportional to distance from center
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const center = width / 2;

    const maxSpeed = 3; // max pixels per frame
    const distance = x - center;
    // proportional speed
    scrollRef.current.value = (distance / center) * maxSpeed;
  };

  const handleMouseLeave = () => {
    scrollRef.current.value = 0;
  };

  return (
    <div className="w-full">
      <div className="h-2"></div>
      <div className="grid grid-rows-10 grid-cols-3 gap-4 h-full">
        {/* Header */}
        <div className="font-bold text-xl !pt-4 !pl-3">Your refrigerator</div>
        <div className="col-start-3 row-start-1 row-end-2 !pt-4">
          <div className="bg-gray-200 h-[35px] rounded-[10px] flex flex-row items-center">
            <img src={SearchIcon} alt="search" className="h-full w-[16px] !ml-2 !mr-3" />
            <input
              type="text"
              placeholder="Search Ingredients..."
              className="w-full h-full bg-transparent placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-0 pl-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Fridge Section */}
        <div className="font-bold col-start-1 col-end-4 row-start-2 row-end-6">
          <div className="!mb-4">Fridge</div>
          <div
            className="flex gap-4 overflow-x-hidden scrollbar-hide-ingredient h-50"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {filtered
              .filter((item) => item.inFridge === true)
              .map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-[20px] bg-white flex flex-row items-center flex-shrink-0"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-auto opacity-60 shadow-lg h-30 object-cover mb-2 rounded-[20px] transition duration-300 ease-in-out transform hover:scale-115 hover:opacity-100"
                    />
                  ) : (
                    <div className="w-40 h-30 bg-gray-200 flex items-center justify-center rounded-[20px] mb-2">
                      <span className="text-sm text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Freezer Section */}
        <div className="border border-black font-bold col-start-1 col-end-4 row-start-6 row-end-10">
          Freezer
          <div>test</div>
          
        </div>
      </div>
    </div>
  );
}
