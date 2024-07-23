import { useState } from "react"
import { json } from "react-router-dom"

function UserLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    fetch('http://127.0.0.1:8000/authorize/test/')
    .then(res => res.json())
    .then(data => console.log(data))

    function login(event) {
        event.preventDefault()
        fetch('http://127.0.0.1:8000/authorize/login/', {
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

    function signupPage() {
        window.location.pathname = '/signup'
    }

    return (
        <>
            <form action="" onSubmit={login} className="auth-form">
                <div className="auth-input-box">
                    <h2 className="signup-text">Login</h2>
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
                    <button className="signin-button">Log in</button>
                    <p>don't have an account yet? <strong style={{'cursor': 'pointer'}} onClick={signupPage}>Signup</strong></p>
                </div>
            </form>
        </>
    )
}

export default UserLogin