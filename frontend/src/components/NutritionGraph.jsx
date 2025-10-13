import { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from '../contexts/AuthContext.jsx'
import { Chart } from 'react-apexcharts'

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
                
                const searchResult = await fetch("http://localhost:5000/nutrition/dailyReq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Request-ID': `${Date.now()}-${Math.random()}`
                    },
                    body: JSON.stringify(body),
                    signal: abortControllerRef.current.signal
                })
                console.log(searchResult)
                
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
                console.log(nutrients)
            } catch(error){
                if (error.name === 'AbortError') {
                    console.log('aborted')
                    return
                }
                console.error("getNutritionInfo() error:", error)
                setError(error.message)
            } finally {
                console.log(nutrients)
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
    series: [
            {
                name: 'Daily Requirement',
                data: nutrients ? [
                    parseFloat(nutrients.calories) || 0,
                    parseFloat(nutrients.Protein) || 0,
                    parseFloat(nutrients.Fat) || 0,
                    parseFloat(nutrients.Carbohydrate) || 0,
                    parseFloat(nutrients.Sodium) || 0
                ] : [0, 0, 0, 0, 0]
            },
            {
                name: 'Today\'s Intake',
                data: [0, 0, 0, 0, 0]
            }
        ],
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
            categories: ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Sodium'],
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
                Current Nutrition Plan: {userInfo.user.nutritionPlan || 'Default'}
            </p>
            <Chart options={options} series={options.series} type="pie" width={380} />
        </div>
    )
}

export default NutritionGraph