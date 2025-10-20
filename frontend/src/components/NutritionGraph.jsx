import { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from '../contexts/AuthContext.jsx'
import Chart from 'react-apexcharts'

function NutritionGraph(){
    const userInfo = useContext(AuthContext)
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const hasFetched = useRef(false)
    const abortControllerRef = useRef(null)

    const [nutrients, setNutrients] = useState(null)
    const [userTodayMeal, setUserTodayMeal] = useState(null)
    const [userTodayNutrition, setUserTodayNutrition] = useState(null)

    useEffect(() => {
        console.log('useEffect:', userInfo)
        console.log('hasFetched:', hasFetched.current)
        
        if(!userInfo?.user?.characteristics) {
            console.log('invalid user characteristics')
            setLoading(false)
            return
        }

        // if (hasFetched.current) {
        //     console.log('already requested.')
        //     return
        // }

        async function getNutritionRequirementsInfo(){
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            // abortControllerRef.current = new AbortController()

            try {
                setLoading(true)
                setError(null)
                
                const body = {
                    characteristics: userInfo.user.characteristics,
                    nutritionPlan: userInfo.user.nutritionPlan
                }

                console.log('API request:', body)
                
                const searchResult = await fetch("http://localhost:5000/nutrition/dailyReq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Request-ID': `${Date.now()}-${Math.random()}`
                    },
                    body: JSON.stringify(body),
                    // signal: abortControllerRef.current.signal
                })
                console.log(searchResult)
                
                if (!searchResult.ok) {
                    throw new Error(`HTTP error! status: ${searchResult.status}`)
                }
                
                const data = await searchResult.json()
                console.log('API response:', data)
                
                if(data){
                    console.log('Setting nutrients:', data)
                    const nutrientData = {
                        calories: parseFloat(data.calories) || 0,
                        protein: parseFloat(data.Protein) || 0,
                        fat: parseFloat(data.Fat) || 0,
                        carbohydrates: parseFloat(data.Carbohydrate) || 0,
                        sodium: parseFloat(data.Sodium) || 0
                    }
                    setNutrients(nutrientData)
                    console.log('Nutrients set:', nutrientData)
                }

                return data

            } catch(error){
                if (error.name === 'AbortError') {
                    console.log('aborted')
                    return null
                }
                console.error("getNutritionInfo() error:", error)
                setError(error.message)
                return null
            }
        }

        async function getUserTodayMeal() {
            try {
                const response = await fetch(`http://localhost:5000/meal/${userInfo.user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    setUserTodayMeal(data)
                    return data
                } else {
                    console.error('Error fetching user today meal:', response.status)
                    setUserTodayMeal(null)
                    return null
                }
            } catch (error) {
                console.error('Error fetching user today meal:', error)
                setUserTodayMeal(null)
                return null
            }
        }

        async function getUserTodayNutrition(meals) {
            if (!meals || meals.length === 0) {
        setUserTodayNutrition({
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            sodium: 0
        })
        return
    }

    const nutritionTotals = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        sodium: 0
    }

    meals.forEach(meal => {
        meal.items.forEach(item => {
            const ingredient = item.ingredient 
            if (ingredient) {
                const multiplier = item.quantity / 100

                nutritionTotals.calories += (parseFloat(ingredient.calories) * multiplier) || 0
                nutritionTotals.protein += (parseFloat(ingredient.protein) * multiplier) || 0
                nutritionTotals.fat += (parseFloat(ingredient.fat) * multiplier) || 0
                nutritionTotals.carbohydrates += (parseFloat(ingredient.carbohydrates) * multiplier) || 0
                nutritionTotals.sodium += (parseFloat(ingredient.sodium) * multiplier) || 0
            }
        })
    })

    console.log('Total nutrition calculated:', nutritionTotals)
    setUserTodayNutrition(nutritionTotals)
        }

        async function fetchAllData() {
            try {
                setLoading(true)
                setError(null)
                hasFetched.current = true

                const nutritionReq = await getNutritionRequirementsInfo()
                const mealsData = await getUserTodayMeal()
                
                if (mealsData && mealsData.length > 0) {
                    await getUserTodayNutrition(mealsData)
                }
            } catch (error) {
                console.error('Error:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAllData()
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
        
    }, [
        userInfo?.user?.characteristics?.age,
        userInfo?.user?.characteristics?.gender,
        userInfo?.user?.characteristics?.height,
        userInfo?.user?.characteristics?.weight,
        userInfo?.user?.nutritionPlan,
        userInfo?.user?._id,
        userInfo?.token
    ])

    console.log('Rendering with nutrients:', nutrients)

    const series = [
        {
            name: 'Daily Requirement',
            data: nutrients ? [
                nutrients.calories,
                nutrients.protein,
                nutrients.fat,
                nutrients.carbohydrates,
                nutrients.sodium
            ] : [0, 0, 0, 0, 0]
        },
        {
            name: 'Today\'s Intake',
            data: userTodayNutrition ? [
                userTodayNutrition.calories,
                userTodayNutrition.protein,
                userTodayNutrition.fat,
                userTodayNutrition.carbohydrates,
                userTodayNutrition.sodium
            ] : [0, 0, 0, 0, 0]
        }
    ]

    const options = {
        chart: {
            type: 'bar',
            height: 380,
            toolbar: {
                show: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Calories(kcal)', 'Protein(g)', 'Fat(g)', 'Carbohydrates(g)', 'Sodium(mg)'],
        },
        yaxis: {
            title: {
                text: 'Amount'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " units"
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        },
        colors: ['#008FFB', '#00E396']
    }

    if(loading) {
        return <div>Loading nutrition data...</div>
    }
    
    if(error) {
        return <div>Error: {error}</div>
    }
    
    if(!userInfo?.user) {
        return <div>Please login to view nutrition data</div>
    }
    
    if(!nutrients) {
        return <div>No nutrition data available</div>
    }

    return(
        <div className="graphs">
            <p className="plan">
                Current Nutrition Plan: <b>{userInfo.user.nutritionPlan || 'Default'}</b>
            </p>
            <Chart options={options} series={series} type="bar" width={1200} height={700} />
        </div>
    )
}

export default NutritionGraph