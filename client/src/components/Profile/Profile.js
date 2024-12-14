import React, {useRef, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../index.css";
import "../backgrounds.css";
import "./Profile.css";

const VisitedTasks = ({ taskArray }) => {
    const navigate = useNavigate()

    const goToTask = (task_id) => {
        navigate(`/task/${task_id}`)
    }

    return (
        <div className="tasks-array-container">
            {taskArray.map(task => {
                let borderColor = ""
                if (task.is_completed) {
                    borderColor = "greenyellow"
                } else {
                    borderColor = "red"
                }

                return (
                    <div className="task-array-item" key={task.task_id} style={{
                        border: `4px solid ${borderColor}`
                    }}>
                        <span><img id="task-array-emerald" src="./media/images/3D Image - 35emeraldIcon.png" /></span>
                        <p className="task-item-title">{task.title}</p>
                        <p className="task-item-id">{`ID: ${task.task_id}`}</p>
                        <button onClick={() => goToTask(task.task_id)}>Перейти</button>
                    </div>
                )
            })}
        </div>
    )
}

const Profile = () => {
    useEffect(() => {
        document.body.classList.add("profile-background")

        return () => {
            document.body.classList.remove("profile-background")
        }
    }, [])

    const navigate = useNavigate()

    const goToNews = () => {
        navigate('/news')
    }
    const goToHomeWithoutJwt = () => {
        localStorage.removeItem("jwt_token")
        navigate('/')
    }
    const goToTasks = () => {
        navigate('/tasks')
    }
    const goToHome = () => {
        navigate('/')
    }
    const goToCreateTask = () => {
        navigate('/task')
    }

    const [userData, setUserData] = useState({
        id: "",
        email: "",
        nickname: "",
        isTeacher: false,
        visitedTasks: [],
        createdTasks: []
    })

    const [correctTasks, setCorrectTasks] = useState(0)
    const getAmountOfCorrectTasks = () => {
        let result = 0
        userData.visitedTasks.forEach((task) => {
            if (task.is_completed) {
                result += 1
                console.log("+1")
            }
        })
        return setCorrectTasks(result)
    }

    useEffect(() => {
        axios.get("http://localhost:5000/api/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }).then(response => {   
            console.log(response.data)
            setUserData({
                id: response.data.id,
                email: response.data.email,
                nickname: response.data.nickname,
                isTeacher: response.data.is_teacher,
                visitedTasks: response.data.visited_tasks,
                createdTasks: response.data.created_tasks
            })
            console.log(userData)
            getAmountOfCorrectTasks()
        }).catch(error => {
            console.error(error)
        })
    }, [])


    const [userStatClass, setUserStatClass] = useState("user-task-bar-stat" + " " + "selected")
    const [userTasksClass, setUserTasksClass] = useState("user-task-bar-success")
    const [isDisabled, setIsDisabled] = useState(true)

    const changeUserPage = () => {
        if (isDisabled) {
            setUserStatClass("user-task-bar-stat")
            setUserTasksClass("user-task-bar-success" + " " + "selected")
            document.querySelector(".user-tasks-list").style.display = "block"
            document.querySelector(".user-tasks-statistic").style.display = "none"
            setIsDisabled(false)
        } else {
            setUserStatClass("user-task-bar-stat" + " " + "selected")
            setUserTasksClass("user-task-bar-success")
            document.querySelector(".user-tasks-list").style.display = "none"
            document.querySelector(".user-tasks-statistic").style.display = "block"
            setIsDisabled(true)
        }
    }

    const [username, setUsername] = useState("")
    const [isEditing, setMode] = useState(false)
    const editMode = () => {
        if (!isEditing) {
            setMode(true)
            document.querySelector("#edit-button").innerHTML = "Принять"
            document.getElementById("changeBlock").style.display = "none"
            document.getElementById("edit-caption").style.display = "block"

            if (isDisabled) {
                document.querySelector(".user-tasks-statistic").style.display = "none"
            } else {
                document.querySelector(".user-tasks-list").style.display = "none"
            }

            document.querySelector(".edit-container").style.display = "flex"
        } else if (username) {
            setMode(false)
            document.querySelector("#edit-button").innerHTML = "Редактировать"
            document.getElementById("changeBlock").style.display = ""
            document.getElementById("edit-caption").style.display = "none"

            if (isDisabled) {
                document.querySelector(".user-tasks-statistic").style.display = "block"
            } else {
                document.querySelector(".user-tasks-list").style.display = "block"
            }

            document.querySelector(".edit-container").style.display = "none"

            axios.post("http://localhost:5000/api/profile/changeNickname", {
                nickname: username
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                }
            }).then(response => {
                console.log(response)
                navigate(0)
            }).catch(error => {
                console.error(error)
            })
        } else {
            alert("Введите новые данные!")
        }
    }

    const changeStatus = () => {
        axios.post("http://localhost:5000/api/profile/become_a_teacher",
            {
                change: true
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                }
            }
        ).then(response => {
            console.log(response)
            navigate(0)
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
                    <li><a onClick={goToHomeWithoutJwt}>Выйти</a></li>
                </ul>
            </div>
        </header>

        <main>
            <div className="profile-container">
                <div className="user-container">
                    <h1>Пользователь</h1>
                    <div className="user-data">
                        <img src="./media/images/UserLogo.webp" />
                        <div className="user-data-info">
                        <ul>
                            <li>
                                <p className="user-info-title">Имя</p>
                                <p className="user-info-tilda">~</p>
                                <p className="user-info-data">{userData.nickname ? userData.nickname : "Имя не указано"}</p>
                            </li>
                            <li>
                                <p className="user-info-title">ID</p>
                                <p className="user-info-tilda">~</p>
                                <p className="user-info-data">{userData.id}</p>
                            </li>
                            <li>
                                <p className="user-info-title">Почта</p>
                                <p className="user-info-tilda">~</p>
                                <p className="user-info-data">{userData.email}</p>
                            </li>
                            <li>
                                <p className="user-info-title">Статус</p>
                                <p className="user-info-tilda">~</p>
                                <p className="user-info-data">{userData.isTeacher ? "Преподаватель" : "Ученик"}</p>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <button id="edit-button" onClick={editMode}>
                        Редактировать
                    </button>
                </div>
                <div className="user-tasks-container">

                    <div className="user-tasks-bar">
                        <div id="changeBlock">
                        <button className={userStatClass} disabled={isDisabled} onClick={changeUserPage}>
                            Статистика
                        </button>
                        <button className={userTasksClass} disabled={!isDisabled} onClick={changeUserPage}>
                            Выполненные задания
                        </button>
                        </div>
                    
                        <p id="edit-caption" style={{
                            display: "none"
                        }}>
                            Редактирование
                        </p>
                    </div>
                    <div className="user-tasks-statistic">
                        <div className="user-task-statistic-element">
                            <p className="first-stat">Количество попыток выполнения заданий</p>
                            <p className="user-task-tilda">~</p>
                            <p className="last-stat">{userData.visitedTasks.length}</p>
                        </div>
                        <div className="user-task-statistic-element">
                            <div id="completed-tasks" className="first-stat">
                            <p>Правильно выполненные задания</p>
                            <span><img id="task-emerald" src="./media/images/3D Image - 35emeraldIcon.png" /></span>
                            </div>
                            <p className="user-task-tilda">~</p>
                            <p className="last-stat">{correctTasks}</p>
                        </div>
                        {userData.isTeacher && 
                        <div className="user-task-statistic-element">
                            <p className="first-stat">Количество созданных заданий</p>
                            <p className="user-task-tilda">~</p>
                            <p className="last-stat">{userData.createdTasks.length}</p>
                        </div>
                        }

                        {userData.isTeacher == false && <button className="down-button" id="teacher-button" onClick={changeStatus}>Стать учителем</button>}
                        {userData.isTeacher && <button className="down-button" id="create-task-button" onClick={goToCreateTask}>Создать задание</button>}
                    </div>
                    
                    <div className="user-tasks-list">
                        <VisitedTasks taskArray={userData.visitedTasks}/>
                    </div>

                    <div className="edit-container">
                        <p>Имя</p>
                        <input 
                            type="text"
                            placeholder="Введите новое имя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </main>
        </div>
    )
}

export default Profile