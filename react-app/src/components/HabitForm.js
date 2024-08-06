import { useState } from "react"
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";


function HabitForm(props) {
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userInfo')).token)
    const [habitName, setHabitName] = useState('')
    const [noNameCheck, setNoNameCheck] = useState(false)
    const [extraNotes, setExtraNotes] = useState('')
    
    const [dailyClicked, setDailyClicked] = useState(false)
    const [weeklyClicked, setWeeklyClicked] = useState(false)
    const [monthlyClicked, setMonthlyClicked] = useState(false)

    const [daysOfWeek, setDaysOfWeek] = useState([])
    const [daysSelected, setDaysSelected] = useState([])
    const [showDailyVar, setShowDailyVar] = useState(false)

    const [weekInterval, setWeekInterval] = useState(0)
    const [weekIntervalHtml, setWeekIntervalHtml] = useState([])
    const [showWeekVar, setShowWeekVar] = useState(false)

    const [daysOfMonthHtml, setDaysOfMonthHtml] = useState('')
    const [daysOfMonthSelected, setDaysofMonthSelected] = useState([])
    const [showMonthVar, setShowMonthvar] = useState(false)

    const [amountAsGoal, setAmountAsGoal] = useState(false)
    const [timeAsGoal, setTimeAsGoal] = useState(false)
    const [goalAmount, setGoalAmount] = useState('')
    const [timeAmount, setTimeAmount] = useState('')

    const [showAllIcons, setShowAllIcons] = useState(false)
    const [allIconHtml, setAllIconHtml] = useState('')
    const [allIconUrls, setAllIconUrls] = useState([
        'bottle-drink-water-svgrepo-com.svg', 'coffee-svgrepo-com.svg', 'cook-svgrepo-com.svg',
        'cycling-sport-svgrepo-com.svg', 'dumbbell-small-svgrepo-com.svg', 'eat-food-healthy-life-svgrepo-com.svg',
        'gardening-grass-svgrepo-com.svg', 'language-svgrepo-com.svg', 'music-svgrepo-com.svg',
        'notebook-svgrepo-com.svg', 'painting-art-svgrepo-com.svg', 'pencil-svgrepo-com.svg',
        'piano-svgrepo-com.svg', 'programming-svgrepo-com.svg', 'reading-mode-svgrepo-com.svg', 
        'running-svgrepo-com.svg', 'school-flag-svgrepo-com.svg', 'shopping-cart-svgrepo-com.svg',
        'square-check-svgrepo-com.svg', 'swimming-svgrepo-com.svg', 'to-do-list-svgrepo-com.svg',
        'vitamins-vitamin-svgrepo-com.svg', 'walking-svgrepo-com.svg', 'weight-svgrepo-com.svg',
        'work-case-svgrepo-com.svg', 'ying-yang-svgrepo-com.svg', 'yoga-svgrepo-com.svg',
        'garden-flower-gardening-svgrepo-com.svg',
    ])
    const [chosenIcon, setChosenIcon] = useState(process.env.PUBLIC_URL + '/svgs/square-check-svgrepo-com.svg')
    const [userEditing, setUserEditing] = useState(false)
    const [dontUpdateHabit, setDontUpdateHabit] = useState(false)

    
    if (props.isEditHabit && !userEditing && (daysSelected.length === 0 && daysOfMonthSelected.length === 0 && weekInterval ===0 ) && dontUpdateHabit === false) {
        setHabitName(props.habitName)
        setChosenIcon(props.habitIcon)
        setExtraNotes(props.habitNotes)
        if (props.habitDays.length){
            setDailyClicked(true)
            setDaysSelected(props.habitDays)
        }
        else if (props.habitDaysOfMonth.length) {
            setMonthlyClicked(true)
            setDaysofMonthSelected(props.habitDaysOfMonth)
            showMonthly()
        }
        else if (props.habitTimesPerWeek != 0) {
            setWeeklyClicked(true)
            setWeekInterval(props.habitTimesPerWeek)
            showWeekly()
        }

        if (props.habitDuration) {
            setTimeAsGoal(true)
            setTimeAmount(props.habitDuration)
        }
        else {
            setAmountAsGoal(true)
            setGoalAmount(props.habitQuantity)
        }


    }
    
    function editHabit() {
        fetch('http://127.0.0.1:8000/habit/edit/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                habit_id: props.habitId,
                habit_name: habitName,
                habit_icon: chosenIcon,
                habit_notes: extraNotes,
                habit_days: daysSelected,
                habit_days_of_month: daysOfMonthSelected,
                habit_times_per_week: weekInterval,
                habit_duration: timeAmount,
                habit_quantity: goalAmount
            })
        })
        .then(res => res.json())
        .then(data => window.location.reload())
    }

    useEffect(() => {
        showWeekly()
    }, [showWeekVar])

    useEffect(() => {
        showMonthly()
    }, [showMonthVar])

    useEffect(() => {   
        showDaily()
    }, [showDailyVar])

    function createHabit() {
        if (habitName != ''){
            fetch("http://127.0.0.1:8000/habit/create/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userToken}`
                },
                body: JSON.stringify({
                    chosen_icon: chosenIcon,
                    habit_name: habitName,
                    days_selected: daysSelected,
                    week_interval: weekInterval,
                    days_of_month_selected: daysOfMonthSelected,
                    goal_amount: goalAmount,
                    time_amount: timeAmount,
                    extra_notes: extraNotes
                })
            })
            .then(res => res.json())
            .then(data => window.location.reload())
            props.setShowHabitForm(false)
        }
        else{
            setNoNameCheck(true)
        }
    }

    function closeForm() {
        props.setShowHabitForm(false)
    }

    function closeAllIcons() {
        setShowAllIcons(false)
    }

    // when a user clicks a certain interval (daily, weekly or monthly), it will show more information, 
    // so the user can choose how much of that interval (ex weekly: 2 times a week, daily: monday, wedesnday)
    function showDaily() {
        setWeekInterval(0)
        setWeekIntervalHtml([])
        setDaysofMonthSelected([])
        setDailyClicked(true)
        setWeeklyClicked(false)
        setMonthlyClicked(false)
        let tempDaysList = []
        let days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        for (let i=0; i < 7; i++) {
            tempDaysList.push(
                <div className="day-selection" key={i} onClick={() => daysAdded(i)} style={{backgroundColor: daysSelected.includes(i) && '#DEB887'}}>
                    {days[i]}
                </div>
            )
        }
        setDaysOfWeek(tempDaysList)
    }
    

    function showWeekly() {
        let amounts = ['1', '2', '3', '4', '5', '6']
        let tempWeekInterval = []
        if (props.isEditHabit && !userEditing) {
            let weekInterval = props.habitTimesPerWeek
            for(let i=1; i < 7; i++) {
                tempWeekInterval.push(
                    <div className="day-selection" key={i} onClick={() => weeksAdded(i)} style={{backgroundColor: weekInterval === i && '#DEB887'}}>
                        {amounts[i-1]}
                    </div>
                )
            }
        }
        else {
            for(let i=1; i < 7; i++) {
                tempWeekInterval.push(
                    <div className="day-selection" key={i} onClick={() => weeksAdded(i)} style={{backgroundColor: weekInterval === i && '#DEB887'}}>
                        {amounts[i-1]}
                    </div>
                )
            }
        }
        setDaysSelected([])
        setDaysofMonthSelected([])
        setDailyClicked(false)
        setWeeklyClicked(true)
        setMonthlyClicked(false)


        setWeekIntervalHtml(tempWeekInterval)
    }

    function showMonthly() {
        let daysOfMonth = []
        if (props.isEditHabit && !userEditing) {
            let daysOfMonthSelected = props.habitDaysOfMonth
            for (let i=1; i < 32; i++) {
                daysOfMonth.push(
                    <div className="day-of-month" key={i} onClick={() => monthsAdded(i)} style={{backgroundColor: daysOfMonthSelected.includes(i) && '#DEB887'}}>
                        {i}
                    </div>
                )
            }
        }
        else {
            for (let i=1; i < 32; i++) {
                daysOfMonth.push(
                    <div className="day-of-month" key={i} onClick={() => monthsAdded(i)} style={{backgroundColor: daysOfMonthSelected.includes(i) && '#DEB887'}}>
                        {i}
                    </div>
                )
            }
        }
        setDaysSelected([])
        setWeekInterval(0)
        setWeekIntervalHtml([])
        setDailyClicked(false)
        setWeeklyClicked(false) 
        setMonthlyClicked(true)
        setDaysOfMonthHtml(daysOfMonth)
    }

    // the days, weeks, month added methods, makes it so that it tracks which days the user wants the habit to be repeated
    function daysAdded(dayIndex) {
        setDaysSelected(prevdaysSelected => {
            const updatedDaysSelected = [...prevdaysSelected, dayIndex]
            return updatedDaysSelected
        })
        setShowDailyVar(dayIndex)
        setUserEditing(true)
    }   

    function weeksAdded(weekIndex) {

        setWeekInterval(weekIndex)
        setShowWeekVar(weekIndex)
        setUserEditing(true)
    }

    function monthsAdded(monthIndex) {
        setDaysofMonthSelected(prevdaysSelected => {
            const updatedDaysSelected = [...prevdaysSelected, monthIndex]
            return updatedDaysSelected
        })
        setShowMonthvar(monthIndex)
        setUserEditing(true)
    }

    function amountGoal() {
        setTimeAsGoal(false)
        setAmountAsGoal(true)
    }

    function timeGoal() {
        setAmountAsGoal(false)
        setTimeAsGoal(true)
    }

    function loadIconPage() {
        setShowAllIcons(true)
        addIconHtml()
    }

    function addIconHtml() {
        let tempIconHtml = []
        for (let i=0; i < allIconUrls.length; i++) {
            tempIconHtml.push(
                <img src={process.env.PUBLIC_URL + '/svgs/' + allIconUrls[i]} 
                className="habit-icons" 
                onClick={() => chooseIcon(process.env.PUBLIC_URL + '/svgs/' + allIconUrls[i])} 
                key={i}/>
            )
        }
        setAllIconHtml(tempIconHtml)
    }

    function chooseIcon(iconUrl) {
        setChosenIcon(iconUrl)
        setShowAllIcons(false)
    }

    return (
        <>
            <div className="black-background" onClick={closeForm}></div>
            <div className="habit-form">
                <IoMdClose className="close-habit-form" onClick={closeForm}/>
                    <p className="choose-icon-txt" onClick={loadIconPage}>choose icon</p>
                    <img src={chosenIcon} alt="" className="create-habit-icon" onClick={loadIconPage}/>
                    <div>
                        <input type="text"  
                        className="habit-form-name" 
                        placeholder="enter habit name"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        />
                    </div>
                    <div className="habit-form-container">
                        <div className="interval-choices">
                            <button className="interval-button" onClick={() => {showDaily(); setDontUpdateHabit(true)}} style={{backgroundColor: dailyClicked && '#DEB887'}}>daily</button>
                            <button className="interval-button" onClick={() => {showWeekly(); setDontUpdateHabit(true)}} style={{backgroundColor: weeklyClicked && '#DEB887'}}>weekly</button>
                            <button className="interval-button" onClick={() => {showMonthly(); setDontUpdateHabit(true)}} style={{backgroundColor: monthlyClicked && '#DEB887'}}>monthly</button>
                        </div>
                        {dailyClicked &&
                            <div className="days-of-week-container">
                                {daysOfWeek}
                            </div>
                        }
                        {weeklyClicked &&
                            <div className="days-of-week-container" style={{marginLeft: '90px'}}>
                                {weekIntervalHtml}
                            </div>
                        }
                        {weekInterval !=0 &&
                            <div className="times-per-week-txt">
                                 Numer of times per week: {weekInterval}
                            </div>
                        }
                        {monthlyClicked &&
                            <div className="days-of-month-container">
                                {daysOfMonthHtml}
                            </div>
                        }
                    </div>
                    <div className="habit-form-container">
                        <p style={{marginLeft: '10px'}}>Add specific goal</p>
                        <div style={{marginLeft: '100px'}}>
                            <button className="goal-button" style={{backgroundColor: amountAsGoal && '#DEB887'}} onClick={amountGoal}>Amount</button>
                            <button className="goal-button" style={{backgroundColor: timeAsGoal && '#DEB887'}} onClick={timeGoal}>Time</button>
                        </div>
                        {amountAsGoal &&
                            <div className="amount-input-container">
                                <input type="number" max={9999} className="amount-input"
                                value={goalAmount}
                                onChange={(e) => setGoalAmount(e.target.value)}
                                />
                                <p>times</p>
                            </div>
                        }
                        {timeAsGoal &&
                            <div className="amount-input-container">
                                <input type="number" max={9999} className="amount-input"
                                value={timeAmount}
                                onChange={(e) => setTimeAmount(e.target.value)}
                                />
                                <p>minutes</p>
                            </div>
                        }
                    </div>
                    <div className="habit-form-container">
                        <textarea name="" id="" placeholder="extra notes ..." className="habit-extra-notes"
                        value={extraNotes}
                        onChange={(e) => setExtraNotes(e.target.value)}
                        ></textarea>
                    </div>
                    {noNameCheck &&
                        <p style={{marginLeft: '300px'}}>Please enter a habit name</p>
                    }
                    {props.isEditHabit 
                    ?   <button className="create-habit-button" onClick={editHabit}>save habit</button>
                    :   <button className="create-habit-button" onClick={createHabit}>create habit</button>
                    }
                    
            </div>
            {showAllIcons &&
                <div>
                    <div className="black-background-3" onClick={closeAllIcons}></div>
                    <div className="all-icons-popup">
                        <IoMdClose className="close-habit-form" onClick={closeAllIcons}/>
                        <div className="icon-container">
                            {allIconHtml}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default HabitForm