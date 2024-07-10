import { useState } from "react"

function UserSignup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function signup(event) {
        event.preventDefault()
        fetch('http://127.0.0.1:8000/authorize/signup/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('userInfo', JSON.stringify(data))
            window.location.pathname = '/home'
        })
    }

    function loginPage() {
        window.location.pathname = '/login'
    }

    return (
        <>

            <form action="" onSubmit={signup} className="auth-form">
                <div className="auth-input-box">
                    <h2 className="signup-text">Sign up</h2>
                    <div>
                        <input type="text" placeholder="username" className="user-signin-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input type="password" placeholder="password" className="user-signin-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="signin-button">sign in</button>
                    <p>already have an account? <strong style={{'cursor': 'pointer'}} onClick={loginPage}>Login</strong></p>
                </div>
            </form>

        </>
    )   
}

export default UserSignup