import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Chart } from 'react-apexcharts'

async function getNutritionRequirementsInfo(){
    try{
        const userInfo = useContext(AuthContext)
        const body = {
            characteristics: userInfo.characteristics,
            nutritionPlan: userInfo.nutritionPlan
        }
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
async function getTodayNutritionConsumption(){
    //on development
}

function NutritionGraph(){
    //nutrients: calories, protein, fat, carb, sodium == main nutrients
    //further implementation: detailed info including other nutrients

    const userInfo = useContext(AuthContext)
    const nutrients = getNutritionRequirementsInfo()
    const options = {
          series: [44, 55, 13, 43, 22],
          chart: {
          width: 380,
          type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
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
        };
    return(
        <div className="graphs">
            <p className="plan">Current Nutrition Plan: {userInfo.nutritionPlan}</p>
            <Chart options={options}/>
        </div>
    )
}
export default NutritionGraph