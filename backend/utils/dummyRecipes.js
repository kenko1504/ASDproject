// Utility functions for generating randomised dummy recipe data

// Helper function to get random element from array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random number in range
const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to get random quantity based on measurement type
const getRandomQuantity = (measurementType) => {
  if (measurementType === 'ml') {
    return getRandomInRange(50, 500);
  } else if (measurementType === 'grams') {
    return getRandomInRange(50, 1000);
  } else {
    return getRandomInRange(1, 6);
  }
};

// Fall back recipe images
export const getRecipeImages = () => {
  return [
    "src/assets/recipeImages/Recipe1.jpg",
    "src/assets/recipeImages/Recipe2.jpg",
    "src/assets/recipeImages/Recipe3.jpg",
    "src/assets/recipeImages/Recipe4.jpg",
    "src/assets/recipeImages/Recipe5.jpg",
    "src/assets/recipeImages/Recipe6.jpg",
    "src/assets/recipeImages/Recipe7.jpg",
    "src/assets/recipeImages/Recipe8.jpg",
    "src/assets/recipeImages/Recipe9.jpg",
    "src/assets/recipeImages/Recipe10.jpg"
  ];
};

// Difficulty levels
const difficulties = ['Easy', 'Medium', 'Hard'];

// Measurement types
const measurementTypes = ['grams', 'ml'];

// Base recipe templates with names, descriptions, and instructions
const recipeTemplates = [
  {
    name: "Classic Spaghetti Bolognese",
    description: "A traditional Italian pasta dish with rich meat sauce, perfect for family dinners.",
    instructions: [
      "Heat olive oil in a large pan over medium heat",
      "Add onions and cook until translucent",
      "Add ground meat and cook until browned",
      "Add tomatoes and simmer for 30 minutes",
      "Cook pasta according to package instructions",
      "Combine pasta with sauce and serve hot"
    ]
  },
  {
    name: "Chicken Caesar Salad",
    description: "Fresh crisp lettuce with grilled chicken, parmesan, and creamy caesar dressing.",
    instructions: [
      "Season and grill chicken breasts",
      "Chop romaine lettuce",
      "Make caesar dressing",
      "Slice grilled chicken",
      "Toss lettuce with dressing",
      "Top with chicken and parmesan"
    ]
  },
  {
    name: "Beef Stir Fry",
    description: "Quick and delicious beef stir fry with fresh vegetables and savory sauce.",
    instructions: [
      "Cut beef into thin strips",
      "Heat wok or large pan",
      "Stir fry beef for 2-3 minutes",
      "Add vegetables and cook 3-4 minutes",
      "Add sauce and toss everything",
      "Serve immediately over rice"
    ]
  },
  {
    name: "Chocolate Chip Cookies",
    description: "Soft and chewy homemade chocolate chip cookies that everyone will love.",
    instructions: [
      "Preheat oven to 180°C",
      "Cream butter and sugars",
      "Beat in eggs and vanilla",
      "Mix in flour gradually",
      "Fold in chocolate chips",
      "Bake for 12-15 minutes until golden"
    ]
  },
  {
    name: "Salmon with Lemon Herbs",
    description: "Pan-seared salmon with fresh herbs and lemon, served with roasted vegetables.",
    instructions: [
      "Season salmon fillets with salt and pepper",
      "Heat oil in a large skillet",
      "Cook salmon skin-side down for 4-5 minutes",
      "Flip and cook another 3-4 minutes",
      "Add lemon juice and herbs",
      "Serve with roasted vegetables"
    ]
  },
  {
    name: "Vegetarian Pizza",
    description: "Homemade pizza with fresh vegetables, mozzarella, and aromatic herbs.",
    instructions: [
      "Prepare pizza dough and let rise",
      "Preheat oven to 220°C",
      "Roll out dough on floured surface",
      "Spread tomato sauce evenly",
      "Add vegetables and cheese",
      "Bake for 15-20 minutes until crispy"
    ]
  },
  {
    name: "Thai Green Curry",
    description: "Aromatic and spicy Thai green curry with coconut milk and fresh vegetables.",
    instructions: [
      "Heat coconut milk in a large pot",
      "Add green curry paste",
      "Add chicken and cook until tender",
      "Add vegetables and simmer",
      "Season with fish sauce and sugar",
      "Serve with jasmine rice"
    ]
  },
  {
    name: "Apple Crumble",
    description: "Classic apple crumble with buttery oat topping, perfect with vanilla ice cream.",
    instructions: [
      "Preheat oven to 190°C",
      "Peel and slice apples",
      "Place apples in baking dish",
      "Mix oats, flour, and butter for topping",
      "Sprinkle topping over apples",
      "Bake for 35-40 minutes until golden"
    ]
  },
  {
    name: "Mushroom Risotto",
    description: "Creamy arborio rice cooked slowly with mushrooms and parmesan cheese.",
    instructions: [
      "Heat stock in a separate pan",
      "Sauté mushrooms until golden",
      "Add rice and toast for 2 minutes",
      "Add wine and stir until absorbed",
      "Add stock gradually, stirring constantly",
      "Finish with parmesan and butter"
    ]
  },
  {
    name: "BBQ Pulled Pork",
    description: "Slow-cooked pork shoulder with smoky BBQ sauce, perfect for sandwiches.",
    instructions: [
      "Rub pork shoulder with spices",
      "Let rest overnight in refrigerator",
      "Preheat oven to 160°C",
      "Cook covered for 6-8 hours",
      "Shred meat with two forks",
      "Mix with BBQ sauce and serve"
    ]
  },
  {
    name: "Greek Moussaka",
    description: "Layered casserole with eggplant, meat sauce, and creamy béchamel topping.",
    instructions: [
      "Slice and salt eggplant, let drain",
      "Make meat sauce with onions and tomatoes",
      "Prepare béchamel sauce",
      "Layer eggplant and meat sauce",
      "Top with béchamel and cheese",
      "Bake until golden and bubbly"
    ]
  },
  {
    name: "Fish Tacos",
    description: "Crispy fish with fresh cabbage slaw and tangy lime crema in soft tortillas.",
    instructions: [
      "Season and bread fish fillets",
      "Fry fish until golden and crispy",
      "Make cabbage slaw with lime dressing",
      "Prepare lime crema sauce",
      "Warm tortillas",
      "Assemble tacos with all components"
    ]
  },
  {
    name: "Beef Wellington",
    description: "Elegant beef tenderloin wrapped in puff pastry with mushroom duxelles.",
    instructions: [
      "Sear beef tenderloin on all sides",
      "Prepare mushroom duxelles",
      "Wrap beef in prosciutto and mushrooms",
      "Encase in puff pastry",
      "Brush with egg wash",
      "Bake until pastry is golden"
    ]
  },
  {
    name: "Ramen Noodle Soup",
    description: "Rich and flavorful ramen with tender pork, soft-boiled eggs, and fresh toppings.",
    instructions: [
      "Prepare rich pork or chicken broth",
      "Cook ramen noodles until tender",
      "Prepare soft-boiled eggs",
      "Slice green onions and other toppings",
      "Assemble bowls with noodles and broth",
      "Top with eggs, meat, and vegetables"
    ]
  },
  {
    name: "Stuffed Bell Peppers",
    description: "Colorful bell peppers stuffed with seasoned rice, ground meat, and vegetables.",
    instructions: [
      "Cut tops off peppers and remove seeds",
      "Cook rice until tender",
      "Sauté onions and ground meat",
      "Mix rice, meat, and seasonings",
      "Stuff peppers with mixture",
      "Bake covered until peppers are tender"
    ]
  }
];

// Function to generate randomised dummy recipes
export const generateRandomisedRecipes = (foods, count = 10, imageUrls = null) => {
  if (foods.length < 10) {
    throw new Error("Not enough food items in database to create recipes");
  }

  // Use provided image URLs or fallback to default paths
  const recipeImages = imageUrls || getRecipeImages();

  const selectedTemplates = [];
  const usedIndices = new Set();

  // Select random unique templates
  while (selectedTemplates.length < count && selectedTemplates.length < recipeTemplates.length) {
    const randomIndex = Math.floor(Math.random() * recipeTemplates.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedTemplates.push(recipeTemplates[randomIndex]);
    }
  }

  return selectedTemplates.map(template => {
    // Randomise cook time based on difficulty
    let minTime, maxTime;
    const difficulty = getRandomElement(difficulties);

    switch (difficulty) {
      case 'Easy':
        minTime = 10;
        maxTime = 120;
        break;
      case 'Medium':
        minTime = 60;
        maxTime = 300;
        break;
      case 'Hard':
        minTime = 90;
        maxTime = 1380;
        break;
      default:
        minTime = 10;
        maxTime = 1380;
    }

    // Generate 3-16 random ingredients
    const numIngredients = getRandomInRange(3, 16);
    const ingredients = [];
    const usedFoodIndices = new Set();

    for (let i = 0; i < numIngredients; i++) {
      let foodIndex;
      do {
        foodIndex = Math.floor(Math.random() * Math.min(foods.length, 1600));
      } while (usedFoodIndices.has(foodIndex));

      usedFoodIndices.add(foodIndex);
      const measurementType = getRandomElement(measurementTypes);

      ingredients.push({
        ingredient: foods[foodIndex]._id,
        quantity: getRandomQuantity(measurementType),
        measurementType: measurementType
      });
    }

    return {
      name: template.name,
      cookTime: getRandomInRange(minTime, maxTime),
      difficulty: difficulty,
      description: template.description,
      image: getRandomElement(recipeImages),
      ingredients: ingredients,
      instructions: template.instructions
    };
  });
};