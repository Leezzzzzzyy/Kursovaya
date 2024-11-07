import React, {useRef, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate()

    const goToNews = () => {
        navigate('/news')
    }
    const goToLogin = () => {
        navigate('/login')
    }
    const goToTasks = () => {
        navigate('/tasks')
    }
    const goToHome = () => {
        navigate('/')
    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const login = (event) => {
        event.preventDefault()
        axios.post("http://localhost:5000/api/login", 
            {
                email: email,
                password: password
            }
        ).then(response => {
            console.log(response)
            localStorage.setItem("jwt_token", response.data.access_token)
            navigate('/profile')
        }).catch(error => {
            console.error(error)
        })
    }

    return (
        <div className="mainContainer">
        <header>
            <div className="header-logo" onClick={goToHome}>
                <span className="header-logo-decor">{"{"}</span>
                <span className="header-logo-main">Former</span>
                <span className="header-logo-decor">{"}"}</span>
            </div>
            <div className="header-links-wrapper">
                <ul>
                    <li><a onClick={goToNews}>Новости</a></li>
                    <li><a onClick={goToTasks}>Задания</a></li>
                    <li><a onClick={goToLogin}>Войти</a></li>
                </ul>
            </div>
        </header>

        <main>
            <div className="main-form-wrapper">
                <form onSubmit={login}>
                    <label>
                        Вход
                    </label>
                    <input
                        className="form-input"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className="form-input"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit">Войти в Личный Кабинет</button>
                </form>
            </div>
        </main>
        </div>
    )
}

export default Login
