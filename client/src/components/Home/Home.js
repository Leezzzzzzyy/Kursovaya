import React, {useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'
import '../../index.css'
import '../backgrounds.css'


const Home = () => {
    useEffect(() => {
        document.body.classList.add("home-background")

        return () => {
            document.body.classList.remove("home-background")
        }
    })
    const navigate = useNavigate()

    const goToNews = () => {
        navigate('/news')
    }
    const goToLogin = () => {
        if (localStorage.getItem("jwt_token")) {
            navigate('/profile')
        } else {
            navigate('/login')
        }
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
                        <div>
                        <p>
                            D<span><svg width="120" height="105" viewBox="0 0 120 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 24.6142H108M84 75.2351H66M36 52.2251L48 63.7301L36 75.2351M6 79.8382V24.6142C6 18.1708 6 14.9467 7.30792 12.4856C8.4584 10.3208 10.2928 8.56207 12.5508 7.45905C15.1177 6.20508 18.4805 6.20508 25.2012 6.20508H94.8011C101.522 6.20508 104.877 6.20508 107.444 7.45905C109.702 8.56207 111.543 10.3208 112.693 12.4856C114 14.9443 114 18.1645 114 24.5953V79.8547C114 86.2855 114 89.5012 112.693 91.9599C111.543 94.1247 109.702 95.8893 107.444 96.9923C104.88 98.2451 101.526 98.2451 94.8185 98.2451L25.1817 98.2451C18.474 98.2451 15.1152 98.2451 12.5508 96.9923C10.2928 95.8893 8.4584 94.1247 7.30792 91.9599C6 89.4988 6 86.2816 6 79.8382Z" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></span>
                            <br />
                            Check <br />
                            Learn
                        </p>
                        </div>
                    </div>
                    <div className="hero-right">
                        <h1 className="hero-right-title">Это<span><img src="/media/images/FORMERmainCaption.png"/></span></h1>
                        <div className="hero-right-description">
                            Платформа, направленная на решение <br/>задач по программированию.<br/>
                            Это идеальное пространство для <br/>обучения, взаимодействия и роста.
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
