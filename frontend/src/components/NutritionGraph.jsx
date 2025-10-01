import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext.jsx'
import { Chart } from 'react-apexcharts'


async function getTodayNutritionConsumption(){
    //on development
}

function NutritionGraph(){
    //nutrients: calories, protein, fat, carb, sodium == main nutrients
    //further implementation: detailed info including other nutrients

    const userInfo = useContext(AuthContext)
    const [nutrients, setNutrients] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getNutritionRequirementsInfo(){
        try{
            const userInfo = useContext(AuthContext)
            const body = {
                characteristics: userInfo.user.characteristics,
                nutritionPlan: userInfo.user.nutritionPlan
            }

            console.log()
            const searchResult = await fetch("http://localhost:5000/nutrition/dailyReq",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(body) 
                }
            )
            const data = await searchResult.json();
            if(data){
                const nutrients = {
                    calories: data.calories,
                    protein: data.protein,
                    fat: data.fat,
                    carbohydrates: data.carbohydrates,
                    sodium: data.sodium
                }
                return nutrients;
            }
        }catch(error){
            console.log("error at getNutritionInfo()", error)
        }
    }
    if(userInfo?.user?.characteristics && userInfo?.user?.nutritionPlan) {
            getNutritionRequirementsInfo()
        }
    }, [userInfo])

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

    if(loading) return <div>Loading...</div>
    if(!nutrients) return <div>No data available</div>

    return(
        <div className="graphs">
            <p className="plan">
                Current Nutrition Plan: {userInfo?.user?.nutritionPlan}
            </p>
            <Chart options={options} series={options.series} type="pie" width={380} />
        </div>
    )
}
export default NutritionGraph