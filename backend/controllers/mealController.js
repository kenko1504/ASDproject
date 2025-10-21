import Meal from "../models/meal.js"


//Meal CRUD
export const getUserTodayMeal = async (req, res) =>{
    const userId = req.body.id
    const searchDate = Date.now()
    
    const startOfDay = new Date(searchDate)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(searchDate)
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1)
    endOfDay.setUTCHours(0, 0, 0, 0)

    const mealToday = await Meal.find({
        userId: userId,
        date: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    })
    
    res.json(mealToday)
}
export const getUserSpecificDayMeal = async(req, res) => {
    const userId = req.body.id
    const searchDate = Date.now()
    
    const startOfDay = new Date(searchDate)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(searchDate)
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1)
    endOfDay.setUTCHours(0, 0, 0, 0)

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
    const {userId, date, mealType, items} = req.body
    if(!userId || !date || !mealType || !items){
        return res.status(400).json({erorr: "All Required fileds must be provided"})
    }
    const newMeal = new Meal({
        userId,
        date: Date.now,
        mealType,
        items
    })
    await newMeal.save()

    const populatedMeal = await Meal.findById(newMeal._id).populate('items.name')
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
    ).populate('items.name')

    if (!updatedMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.status(200).json(updatedRecipe);
    }catch(error){
        res.status(500).json({ error: err.message });
    }
}