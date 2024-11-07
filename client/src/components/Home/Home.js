import React, {useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'
import '../../index.css'



const Home = () => {
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
    const goToRegistration = () => {
        navigate('/registration')
    }
    const goToHome = () => {
        navigate('/')
    }

    const mainElement = useRef(null)
    useEffect(() => {
        if (mainElement.current) {
            mainElement.current.style.opacity = 1
        }
    })

    return (
            <div className="mainContainer" ref={mainElement} style={{
                opacity: 0,
                transition: 'all 1s ease'
            }}>
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
                <div className="hero">
                    <div className="hero-left">
                        <p>
                            Do <br />
                            Check <br />
                            Learn
                        </p>
                    </div>
                    <div className="hero-right">
                        <h1 className="hero-right-title">Это<span>FORMER</span></h1>
                        <div className="hero-right-description">
                            Платформа, направленная на решение задач по программированию.
                            Это идеальное пространство для обучения, взаимодействия и роста.
                        </div>
                        <button onClick={goToRegistration}>
                            Начать
                        </button>
                    </div>
                </div>
            </main>
            </div>
    )
}

export default Home
