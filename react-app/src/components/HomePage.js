import HabitForm from "./HabitForm"
import { useState } from "react"

function HomePage() {
    const [showHabitForm, setShowHabitForm] = useState(false)

    return (
        <>
            {showHabitForm && <HabitForm showHabitForm={showHabitForm} setShowHabitForm={setShowHabitForm}/>}
            <div>
                <button onClick={() => setShowHabitForm(true)} className="add-habit">add habit</button>
            </div>
            <div>

            </div>
            
        </>
    )
}

export default HomePage