import { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from '../contexts/AuthContext.jsx'
import { Chart } from 'react-apexcharts'
import { API_BASE_URL } from '../utils/api.js';

function NutritionGraph(){
    const userInfo = useContext(AuthContext)
    const [nutrients, setNutrients] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const hasFetched = useRef(false)
    const abortControllerRef = useRef(null)

    useEffect(() => {
        console.log('useEffect:', userInfo)
        
        if(!userInfo?.user?.characteristics) {
            console.log('invalid user characteristics')
            setLoading(false)
            return
        }

        if (hasFetched.current) {
            console.log('already requested.')
            return
        }

        async function getNutritionRequirementsInfo(){
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            abortControllerRef.current = new AbortController()

            try {
                setLoading(true)
                setError(null)
                hasFetched.current = true
                
                const body = {
                    characteristics: userInfo.user.characteristics,
                    nutritionPlan: userInfo.user.nutritionPlan
                }

                console.log('API request:', body)
                
                const searchResult = await fetch(`${API_BASE_URL}/nutrition/dailyReq`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Request-ID': `${Date.now()}-${Math.random()}`
                    },
                    body: JSON.stringify(body),
                    signal: abortControllerRef.current.signal
                })
                
                if (!searchResult.ok) {
                    throw new Error(`HTTP error! status: ${searchResult.status}`)
                }
                
                const data = await searchResult.json()
                console.log('API response:', data)
                
                if(data){
                    setNutrients({
                        calories: parseFloat(data.calories) || 0,
                        protein: parseFloat(data.protein) || 0,
                        fat: parseFloat(data.fat) || 0,
                        carbohydrates: parseFloat(data.carbohydrate) || 0,
                        sodium: parseFloat(data.sodium) || 0
                    })
                }
            } catch(error){
                if (error.name === 'AbortError') {
                    console.log('aborted')
                    return
                }
                console.error("getNutritionInfo() error:", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        getNutritionRequirementsInfo()

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
        userInfo?.user?.nutritionPlan
    ])

    useEffect(() => {
        hasFetched.current = false
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
            <Chart options={options} type="pie" width={380} />
        </div>
    )
}

export default NutritionGraph