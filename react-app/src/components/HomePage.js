import HabitForm from "./HabitForm"
import { CiClock1 } from "react-icons/ci";
import { useState, useEffect } from "react"

function HomePage() {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userInfo')).token)

    const [showHabitForm, setShowHabitForm] = useState(false)

    const [habitListHtml, setHabitListHtml] = useState([])
    const [isEditHabit, setIsEditHabit] = useState(false)

    // fields to send to habit form, so the user can preview or edit the habit
    const [habitName, setHabitName] = useState('')
    const [habitIcon, setHabitIcon] = useState('')
    const [habitDuration, setHabitDuration] = useState('')
    const [habitQuantity, setHabitQuantity] = useState('')
    const [habitDays, setHabitDays] = useState('')
    const [habitDaysOfMonth, setHabitDaysOfMonth] = useState('')
    const [habitTimesPerWeek, setHabitTimesPerWeek] = useState('')
    const [habitNotes, setHabitNotes] = useState('')
    const [habitId, setHabitId] = useState('')

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
                    <div key={i} className="habit-preview" onClick={() => editHabit(i, data)}>
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
        })
    }, [])

    
    function editHabit(index, data) {
        setIsEditHabit(true)
        let habit = data.habits_data[index]
        setHabitName(habit.name)
        setHabitIcon(habit.icon_url)
        setHabitDays(habit.days)
        setHabitDaysOfMonth(habit.days_of_month)
        setHabitTimesPerWeek(habit.times_per_week)
        setHabitNotes(habit.notes)
        setHabitDuration(habit.duration)
        setHabitQuantity(habit.quantity)
        setHabitId(habit.id)

        setShowHabitForm(true)
        console.log(habit)
    }

    function createHabit() {
        setIsEditHabit(false)
        setShowHabitForm(true)
    }

    return (
        <>
            {showHabitForm && 
                <HabitForm showHabitForm={showHabitForm} setShowHabitForm={setShowHabitForm} isEditHabit={isEditHabit}
                           habitName={habitName} habitIcon={habitIcon} habitDays={habitDays} 
                           habitDaysOfMonth={habitDaysOfMonth} habitTimesPerWeek={habitTimesPerWeek} habitNotes={habitNotes} 
                           habitDuration={habitDuration} habitQuantity={habitQuantity} habitId={habitId}
                />
            }
            <div>
                <button onClick={createHabit} className="add-habit">add habit</button>
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