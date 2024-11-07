import React, {useRef, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Profile = () => {
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

    const [userData, setUserData] = useState({
        id: "",
        email: ""
    })

    useEffect(() => {
        axios.get("http://localhost:5000/api/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }).then(response => {
            console.log(response.data)
            setUserData({
                id: response.data.id,
                email: response.data.email
            })
        }).catch(error => {
            console.error(error)
        })
    })

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
            <p>User id: {userData.id}</p>
            <p>User email: {userData.email}</p>
        </main>
        </div>
    )
}

export default Profile