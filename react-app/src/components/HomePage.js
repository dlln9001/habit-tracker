import HabitForm from "./HabitForm"
import { CiClock1 } from "react-icons/ci";
import { useState, useEffect } from "react"

function HomePage() {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userInfo')).token)

    const [showHabitForm, setShowHabitForm] = useState(false)

    const [habitListHtml, setHabitListHtml] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/habit/get/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            let tempListHtml = []
            for(let i=0; i<data.habits_data.length; i++) {
                let current_habit = data.habits_data[i]
                let durationOrQuantity = 'quantity'
                if (current_habit.duration) {
                    durationOrQuantity = 'duration'
                }
                tempListHtml.push(
                    <div key={i} className="habit-preview">
                        <img src={process.env.PUBLIC_URL + current_habit.icon_url} alt="" className="habit-preview-icon"/>
                        <p className="habit-preview-name">{current_habit.name}</p>
                        {durationOrQuantity === 'quantity'
                        ? <p className="quantity-container" style={{marginTop: '30px'}}>{current_habit.quantity} times</p>
                        : 
                        <div className="quantity-container">
                            <CiClock1 className="duration-icon"/>
                            <p style={{marginBottom: '5px', marginTop: '10px'}}>{current_habit.duration} min</p>
                        </div>
                        }
                    </div>
                )
            }
            setHabitListHtml(tempListHtml)
            console.log(data)
        })
    }, [])

    return (
        <>
            {showHabitForm && <HabitForm showHabitForm={showHabitForm} setShowHabitForm={setShowHabitForm}/>}
            <div>
                <button onClick={() => setShowHabitForm(true)} className="add-habit">add habit</button>
            </div>
            <div className="list-of-habits">
                {habitListHtml &&
                    habitListHtml
                }
            </div>
            
        </>
    )
}

export default HomePage