import Meal from "../models/meal.js"
import Food from "../models/food.js"


//Meal CRUD
export const getUserTodayMeal = async (req, res) => {
  const userId = req.params.id;

  const now = new Date();

  const startOfDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));
  const endOfDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  ));

  console.log("Search Range:");
  console.log("Start:", startOfDay.toISOString());
  console.log("End:", endOfDay.toISOString());

  console.log("UserId:", userId)

  const mealToday = await Meal.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).populate('items.ingredient');

  console.log("Result: ", mealToday)

  console.log("items test",mealToday[0].items)

  res.json(mealToday);
};

export const getUserSpecificDayMeal = async(req, res) => {
    const userId = req.body.id
    const searchDate = Date.now()
    
    const startOfDay = new Date(searchDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(searchDate)
    endOfDay.setHours(23, 59, 59, 999)

    const mealToday = await Meal.find({
        userId: userId,
        date: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    })
    
    res.json(mealToday)
}

export const createMeal = async (req, res) => {
    const {userId, date, recipeId, mealType, items} = req.body
    if(!userId || !date || !recipeId || !mealType || !items){
        return res.status(400).json({error: "All Required fields must be provided"})
    }
    
    const existingMeal = await Meal.findOne({userId, date, recipeId, mealType});
    if (existingMeal) {
        return res.status(400).json({ error: "Meal already exists for the given date and meal type" });
    }

    console.log(date)
    
    const newMeal = new Meal({
        userId,
        date,
        mealType,
        recipeId,
        items
    })
    
    await newMeal.save()

    const populatedMeal = await Meal.findById(newMeal._id).populate('items.ingredient')
    res.status(201).json(populatedMeal)
}

export const deleteMeal = async(req, res) => {
    try{
        const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

export const updateMeal = async(req, res) => {
    try{
    const {userId, date, mealType, items} = req.body
    if(!userId || !date || !mealType || !items){
        return res.status(400).json({erorr: "All Required fileds must be provided"})
    }
    const updatedMeal = await Meal.findByIdAndUpdate(
        req.params.id,    
        {
        userId,
        date: Date.now,
        mealType,
        items
    }
    ).populate('items.ingredient')

    if (!updatedMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.status(200).json(updatedRecipe);
    }catch(error){
        res.status(500).json({ error: err.message });
    }
}
  
export const getFoodById = async(req, res) => {
    try{
        const result = await Food.findById(req.params.id)
        if(!result){
            res.status(404).json({error: "not found"})
        }
        console.log("Food Search Result:", result)
        res.status(200).json(result)
    }catch(error){
        console.log(error)
    }
}
