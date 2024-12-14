import React, {useEffect, useState, useRef} from "react";
import { resolvePath, useNavigate } from "react-router-dom";
import './Tasks.css'
import '../../index.css'
import axios from "axios";

const Tasks = () => {
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

    const [allTasksList, setAllTasksList] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/api/get_all_tasks")
        .then(response => {
            console.log(response)
            setAllTasksList(response.data.all_tasks)
        }).catch(error => console.error(error))
    }, [])

    const goToTask = (taskID) => {
        navigate(`/task/${taskID}`)
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
                        <li><a onClick={goToLogin}>Войти</a></li>
                    </ul>
                </div>
            </header>

            <main>
                <div id="all-tasks-container">
                    {allTasksList.map(task => {
                        let backgroundColor = ""
                        if (Number(task.task_id) % 3 === 0) {
                            backgroundColor = "#010103" 
                        } else if (Number(task.task_id) % 3 === 1) {
                            backgroundColor = "#6747E8"
                        } else {
                            backgroundColor = "#4791E8"
                        }

                        return (
                            <div className="task-list-element" key={task.task_id} style={{
                                backgroundColor: backgroundColor
                            }}>
                                <div className="task-container-top-content">
                                    <div className="top-content-left">
                                        Python
                                    </div>
                                    <div className="top-content-right">
                                        <h1>{task.task_title}</h1>
                                        <p>Автор: {task.creator_name}</p>
                                    </div>
                                </div>
                                <div className="task-container-bottom">
                                    <h3>{task.task_mini_description}...</h3>
                                </div>
                                <button onClick={() => goToTask(task.task_id)}>Начать</button>
                            </div>
                        )
                    })}
                </div>
            </main>
            </div>
    )
}

export default Tasks