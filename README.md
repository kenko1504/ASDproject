# ASDproject
**Project:** Fridge Inventory Management System

**Project consists of three components:**
- Frontend using REACT
- Backend using Node.js and Express
- Database using MongoDB

**Instruction for running the application:**
1. `cd frontend` and run `npm run dev` in a **new terminal** to run frontend locally
2. `cd backend` and run `npm start` in **another terminal** to communicate with the frontend.


## Team Member Contributions:
### Frontend
- **Kenji**
    - `/frontend/src/components/DashBoardComponent/AddButton.jsx`
    - `/frontend/src/components/DashBoardComponent/AddIngredientPopUp.jsx`
    - `/frontend/src/components/FridgeList.jsx`
- **Matthew**
    - `/frontend/src/components/AddRecipe.jsx`
    - `/frontend/src/components/EditRecipe.jsx`
    - `/frontend/src/components/LandingPage.jsx`
    - `/frontend/src/components/LoginModal.jsx`
    - `/frontend/src/components/NutritionPopupModal.jsx`
    - `/frontend/src/components/RecipeCard.jsx`
    - `/frontend/src/components/Recipes.jsx`
    - `/frontend/src/components/RegisterModal.jsx`
    - `/frontend/src/components/Settings.jsx`
    - `/frontend/src/components/ViewRecipe.jsx`
    - `/frontend/src/contexts/AuthContext.jsx`
    - `/frontend/src/utils/api.js`
- **Anthony**
    - `/frontend/src/components/Recommendation.jsx`
    - `/frontend/src/components/AddRecommendToGrocery.jsx`
    - `/frontend/src/components/GroceryList/AddGroceryItem.jsx`
    - `/frontend/src/components/GroceryList/AddGroceryLisr.jsx`
    - `/frontend/src/components/GroceryList/EditGroceryItem.jsx`
    - `/frontend/src/components/GroceryList/EditGroceryList.jsx`
    - `/frontend/src/components/GroceryList/CopyGroceryList.jsx`
    - `/frontend/src/components/GroceryList/IndividualGroceryList.jsx`
    - `/frontend/src/components/GroceryList/GroceryListsDashboard.jsx`
    - `/frontend/src/components/GroceryList/groceryServices.js`
    - `/frontend/src/utils/api.js`
    - `/frontend/src/utils/dateUtils.js`
- **Jianan**
    - `/frontend/src/components/Recommendation.jsx`
    - `/frontend/src/components/FridgeManagement.jsx`
    - `/frontend/src/components/AddItem.jsx` 
    - `/frontend/src/components/UpdateItem.jsx` 
    - `/frontend/src/components/WasteBudget.jsx`
    - `/frontend/src/components/Dashboard.jsx`
    - `/frontend/src/DashboardComponent/Sidebar.jsx`
    - `/frontend/src/components/NavBar.jsx`
- **Martin**
    - `/frontend/src/components/Nutritions.jsx`
    - `/frontend/src/components/NutritionGraph.jsx`
    - `/frontend/src/components/DashBoardComponent/AutoIngredientPopUp.jsx`
    - `/frontend/src/components/DashBoardComponent/ManualIngredientPopUp.jsx`
    - `/frontend/src/components/Recommendation.jsx`
    - `/frontend/src/components/MealCard.jsx`

### Backend
- **Kenji**
    -  `/backend/controller/ingredientController.js`
    -  `/backend/routes/ingredientRoutes.js`
    -  `/backend/imageUploads`
- **Matthew**
    - `/backend/controllers/userController.js`
    - `/backend/controllers/authController.js`
    - `/backend/controllers/recipeController.js`
    - `/backend/controllers/totpController.js`
    - `/backend/middleware/auth.js`
    - `/backend/routes/userRoutes.js`
    - `/backend/routes/authRoutes.js`
    - `/backend/routes/recipeRoutes.js`
    - `/backend/test/userController.test.js`
    - `/backend/utils/dummyRecipes.js`
- **Anthony**
    -  `/backend/controller/groceryListController.js`
    -  `/backend/routes/groceryRoutes.js`
    -  `/backend/controller/recommendController.js`
    -  `/backend/routes/recommendRoutes.js`
- **Jianan**
    -  `/backend/controller/itemController.js`
    -  `/backend/routes/itemRoutes.js`
    -  `/backend/controller/ingredientController.js`
    -  `/backend/routes/ingredientRoutes.js`
- **Martin**
    -  `/backend/routes/nutritionRoutes.js`
    -  `/backend/controller/nutritionController.js`
    -  `/backend/routes/receiptUploadRoutes.js`
    -  `/backend/middleware/upload.js`
    -  `/backend/controller/receiptUploadController.js`
    -  `/backend/controller/mealController.js`

### Database
- **Kenji**
    - `./backend/models/ingredient.js`
- **Matthew**
    - `/backend/models/user.js`
    - `/backend/models/recipe.js`
- **Anthony**
    - `./backend/models/groceryList.js`
    - `./backend/models/groceryItem.js`
    - `./backend/models/foodNutrition.js`
- **Jianan**
    - `/backend/models/item.js`
    - `/backend/models/ingredient.js`
- **Martin**
    - `/backend/models/nutrition.js`
    - `/backend/models/meal.js`
