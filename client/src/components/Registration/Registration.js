import React, {useRef, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Registration = () => {
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

    const registration = (event) => {
        event.preventDefault()
        axios.post("http://localhost:5000/api/registration", 
            {
                email: email,
                password: password
            }
        ).then(response => {
            console.log(response)
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
                <form onSubmit={registration}>
                    <label>
                        Регистрация
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
                    <button type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </main>
        </div>
    )
}

export default Registration