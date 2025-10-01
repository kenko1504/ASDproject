import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext.jsx'
import { Chart } from 'react-apexcharts'

function NutritionGraph(){
    const userInfo = useContext(AuthContext)
    const [nutrients, setNutrients] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log('useEffect:', userInfo)
        
        async function getNutritionRequirementsInfo(){
            try {
                setLoading(true)
                
                const body = {
                    characteristics: userInfo.user.characteristics,
                    nutritionPlan: userInfo.user.nutritionPlan
                }

                console.log('API request body:', body)
                
                const searchResult = await fetch("http://localhost:5000/nutrition/dailyReq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(body) 
                })
                
                const data = await searchResult.json()
                console.log('API response:', data)
                
                if(data){
                    setNutrients({
                        calories: data.calories,
                        protein: data.protein,
                        fat: data.fat,
                        carbohydrates: data.carbohydrates,
                        sodium: data.sodium
                    })
                }
            } catch(error){
                console.error("error at getNutritionInfo()", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if(!userInfo?.user?.characteristics) {
            console.log('User characteristics not found')
            setLoading(false)
            return
        }

        getNutritionRequirementsInfo()
        
    }, [
        userInfo?.user?.characteristics?.age,
        userInfo?.user?.characteristics?.gender,
        userInfo?.user?.characteristics?.height,
        userInfo?.user?.characteristics?.weight,
        userInfo?.user?.nutritionPlan
    ])

    const options = {
        series: nutrients ? [
            nutrients.calories, 
            nutrients.protein, 
            nutrients.fat, 
            nutrients.carbohydrates, 
            nutrients.sodium
        ] : [0, 0, 0, 0, 0],
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Sodium'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 400
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
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
                Current Nutrition Plan: {userInfo.user.nutritionPlan || 'Default'}
            </p>
            <Chart options={options} series={options.series} type="pie" width={380} />
        </div>
    )
}

export default NutritionGraph