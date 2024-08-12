import { useState, useEffect } from "react"


function Calender(props) {
    const [calenderHtml, setCalenderHtml] = useState('')
    const [allDays, setAllDays] = useState([])
    
    useEffect(() => {
        let tempHtml = []
        setAllDays([])

        for (let i=0; i<props.allDaysCompleted.length; i++) {
            let dayOfYear = getDayOfYear(props.allDaysCompleted[i])
            setAllDays((prevArray) => [...prevArray, dayOfYear])
        }
        for (let i=0; i<365; i++) {
            tempHtml.push(
                <div className="calender-day-box" key={i} style={{backgroundColor: allDays.includes(i) && 'lime'}}>
                    
                </div>
            )
            
        }   
        setCalenderHtml(tempHtml)
        console.log(props.allDaysCompleted, 'spaaaace', allDays)
    }, [props.allDaysCompleted, allDays])

    function getDayOfYear (date) {
        var now = new Date(date)
        var start = new Date(now.getFullYear(), 0, 0)
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
        var oneDay = 1000 * 60 * 60 * 24
        var day = Math.floor(diff / oneDay)
        return day
    }

    return (
        <div className="calender-container">
            {calenderHtml &&
                calenderHtml
            }
        </div>
    )
}

export default Calender