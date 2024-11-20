import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../index.css";
import "./Task.css";

const Task = () => {
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
    const goToLc = () => {
        if (localStorage.getItem("jwt_token")) {
            navigate('/profile')
        } else {
            navigate('/login')
        }
    }
    const goToTasks = () => {
        navigate('/tasks')
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

    const [taskTitleName, setTaskTitleName] = useState("")
    const [taskTitleDesc, setTaskTitleDesc] = useState("")
    const [taskTitleOut, setTaskTitleOut] = useState("")

    const addNewTask = () => {
        if (taskTitleDesc && taskTitleName && taskTitleOut) {
            axios.post("http://localhost:5000/api/profile/create_task",
                {
                    title: taskTitleName,
                    description: taskTitleDesc,
                    correct_answer: taskTitleOut
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                }
            ).then(response => {
                console.log(response)
                navigate("/profile")
            }).catch(error => {
                console.error(error)
            })
        }
    }

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
                        <li><a onClick={goToLc}>Вернуться в ЛК</a></li>
                    </ul>
                </div>
            </header>

            <main>
                <div className="task-container">
                    <input 
                        id="name-input"
                        className="task-input"
                        type="text"
                        value={taskTitleName}
                        placeholder="Введите название задания"
                        onChange={e => setTaskTitleName(e.target.value)}
                    />
                    <textarea
                        id="description-input"
                        className="task-input"
                        value={taskTitleDesc}
                        placeholder="Введите описание задания"
                        onChange={e => setTaskTitleDesc(e.target.value)}
                    />
                    <div className="container-row">
                    <input
                        id="input"
                        className="task-input"
                        value={taskTitleOut}
                        placeholder="Выходные данные"
                        onChange={e => setTaskTitleOut(e.target.value)}
                    />
                    <button type="submit" onClick={addNewTask}>Создать</button>
                    </div>
                </div>
            </main>
            </div>
    )
}

export default Task