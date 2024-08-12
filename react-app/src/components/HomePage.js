import HabitForm from "./HabitForm"
import { CiClock1 } from "react-icons/ci";
import { useState, useEffect, useRef } from "react"
import { IoMdClose } from "react-icons/io";

function HomePage() {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userInfo')).token)

    const [showHabitForm, setShowHabitForm] = useState(false)

    const [habitListHtml, setHabitListHtml] = useState([])
    const [isEditHabit, setIsEditHabit] = useState(false)
    const [isViewAllHabits, setIsViewAllHabits] = useState(false)
    const [updateHabits, setUpdateHabits] = useState(false)

    const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 })
    const [showSetHabit, setShowSetHabit] = useState(false)
    const [showSetHabitIndex, setShowSetHabitIndex] = useState(-1)
    const containerRef = useRef(null)

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

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setShowSetHabit(false)
        }
      }

    useEffect(() => {
        fetch('http://127.0.0.1:8000/habit/get/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        })
        .then(res => res.json())
        .then(data => showHabits(data))

    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup function to remove the event listener
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
    }
    
    }, [showSetHabit, updateHabits])  

    function showHabits(data) {
        let tempListHtml = []
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let day = today.getDate()
        let weekday = today.getDay()
        month = month.toString().padStart(2, '0')
        day = day.toString().padStart(2, '0')
        let full_date = `${year}-${month}-${day}`
        for(let i=0; i<data.habits_data.length; i++) {
            let current_habit = data.habits_data[i]
            let durationOrQuantity = 'quantity'
            let dailyHabit = false
            let weeklyHabit = false
            let monthlyHabit = false

            let daysAWeek
            let timesPerMonth

            let numberOfTimesCompleted = current_habit.dates_completed.length
            let daysDone = 0
            let weekDone = 0
            let monthDone = 0
            
            // here, we're calculating how many days have been done in this week. In order to say how many more times we have to do a habit this week
            if (current_habit.days.length) {
                dailyHabit = true
                daysAWeek = current_habit.days.length
            }
            else if (current_habit.times_per_week != 0) {
                weeklyHabit = true
            }
            else {
                monthlyHabit = true
                timesPerMonth = current_habit.days_of_month.length
                let datesCompletedLastIndex = numberOfTimesCompleted - 1
                let localDay = day
                for (let i=localDay; i>0; i--) {
                    let date_completed = current_habit.dates_completed[datesCompletedLastIndex]
                    let dateCompleted = new Date(date_completed)
                    if (today.getMonth() === dateCompleted.getMonth() + 1 && year === dateCompleted.getFullYear()) {
                        monthDone += 1
                    }
                    datesCompletedLastIndex -= 1
                }
            }
            if (dailyHabit || weeklyHabit) {
                let datesCompletedLastIndex = numberOfTimesCompleted - 1
                let localDate = new Date(full_date)
                for (let i=weekday; i>=0; i--) {
                    let date_completed = current_habit.dates_completed[datesCompletedLastIndex]
                    let dateCompleted = new Date(date_completed)
                    if (localDate.getTime() === dateCompleted.getTime()) {
                        if(dailyHabit) {
                            daysDone += 1
                        }
                        if (weeklyHabit) {
                            weekDone += 1
                        }
                    }
                    localDate.setDate(localDate.getDate() - 1)
                    datesCompletedLastIndex -= 1
                }
            }

            if (current_habit.duration) {
                durationOrQuantity = 'duration'
            }

            // skips the habit if it should not be shown today. Either not due today, or did it already for the week
            if (current_habit.days.length && !(current_habit.days.includes(today.getDay())) && !isViewAllHabits) {
                continue
            }
            else if (current_habit.days_of_month.length && !(current_habit.days_of_month.includes(today.getDate())) && !isViewAllHabits) {
                continue    
            }
            else if (current_habit.times_per_week != 0 && (current_habit.times_per_week - weekDone) === 0 && !isViewAllHabits) {
                continue
            }
            tempListHtml.push(
                <div key={i} className="habit-preview" onClick={(e) => habitSet(e, i)} style={{opacity: current_habit.dates_completed.includes(full_date) && 0.4}}>
                    <img src={process.env.PUBLIC_URL + current_habit.icon_url} alt="" className="habit-preview-icon"/>
                    <div>
                        <p className="habit-preview-name">{current_habit.name}</p>
                        {dailyHabit && <p className="times-left">{daysAWeek - daysDone} to go this week</p>}
                        {weeklyHabit && <p className="times-left">{current_habit.times_per_week - weekDone} to go this week</p>}
                        {monthlyHabit && <p className="times-left">{timesPerMonth - monthDone} to go this month</p>}
                    </div>
                    {durationOrQuantity === 'quantity'
                    ? <p className="quantity-container" style={{marginTop: '30px'}}>{current_habit.quantity} times</p>
                    : 
                    <div className="quantity-container">
                        <CiClock1 className="duration-icon"/>
                        <p style={{marginBottom: '5px', marginTop: '10px'}}>{current_habit.duration} min</p>
                    </div>
                    }
                    {(showSetHabit && !isViewAllHabits) &&
                    <div className="habit-set" style={{top: boxPosition.top, left: boxPosition.left}} ref={containerRef}>
                        <div className="habit-set-option" onClick={() => markHabitComplete(showSetHabitIndex, data)}>Mark as Complete</div>
                        <div className="habit-set-option" onClick={() => editHabit(showSetHabitIndex, data)}>Edit Habit</div>
                    </div>
                    }
                </div>
            )
        }
        setHabitListHtml(tempListHtml)
    }

    function markHabitComplete(index, data) {
        let habit = data.habits_data[index]
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let day = today.getDate()
        month = month.toString().padStart(2, '0')
        day = day.toString().padStart(2, '0')
        let full_date = `${year}-${month}-${day}`
        fetch('http://127.0.0.1:8000/habit/mark-complete/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                habit_id: habit.id,
                todays_date: full_date
            })
        })
        .then(res => res.json())
        .then(data => setShowSetHabit(false))
    }

    
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
    }

    function createHabit() {
        setIsEditHabit(false)
        setShowHabitForm(true)
    }

    function habitSet(e, i) {
        setShowSetHabitIndex(i)
        setBoxPosition({
            top: e.pageY + 5, 
            left: e.pageX + 5 
          })
        setShowSetHabit(true)
    }

    function viewAllHabits() {
        setIsViewAllHabits(true)
        setUpdateHabits(!updateHabits)
    }

    function closeAllHabits() {
        setIsViewAllHabits(false)
        setUpdateHabits(!updateHabits)
    }

    return (
        <>
            {isViewAllHabits &&
                <div className="black-background" onClick={closeAllHabits}></ div >
            }
            {showHabitForm && 
                <HabitForm showHabitForm={showHabitForm} setShowHabitForm={setShowHabitForm} isEditHabit={isEditHabit}
                           habitName={habitName} habitIcon={habitIcon} habitDays={habitDays} 
                           habitDaysOfMonth={habitDaysOfMonth} habitTimesPerWeek={habitTimesPerWeek} habitNotes={habitNotes} 
                           habitDuration={habitDuration} habitQuantity={habitQuantity} habitId={habitId}
                />
            }
            <div className="home-page-options-container">
                <button onClick={createHabit} className="home-page-option">add habit</button>
                <button className="home-page-option" onClick={viewAllHabits}>view all habits</button>
            </div>
            {isViewAllHabits &&
                <> 
                    <div className="view-all-habits">
                        <IoMdClose className="close-all-habit-form" onClick={closeAllHabits}/>
                        {habitListHtml}
                    </div>
                </>
            }
            <div className="list-of-habits">
                {habitListHtml &&
                    habitListHtml
                }
            </div>
        </>
    )
}

export default HomePage