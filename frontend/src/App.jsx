import { useState, useEffect } from "react";
import AddIngredient from "./AddIngredient";
import Header from "./Elements/Header";

export default function App() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/ingredients")
      .then(res => res.json())
      .then(data => setIngredients(data))
      .catch(err => console.error(err));
  }, []);

  const handleAdd = (newItem) => {
    setIngredients([...ingredients, newItem]);
  };

  return (
    <>
      <Header></Header>

  
      <div>
        <h1>Ingredients</h1>

        <AddIngredient onAdd={handleAdd} />

        <ul>
          {ingredients.map(item => (
            <li key={item._id}>
              {item.name} - {item.quantity}
            </li>
          ))}
        </ul>
      </div>        

      
    </>
    
  );
}
