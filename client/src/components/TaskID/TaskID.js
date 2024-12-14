import React, {useEffect, useState, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import './TaskID.css'
import '../../index.css'
import axios from "axios";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { lintGutter } from '@codemirror/lint';
import { autocompletion } from "@codemirror/autocomplete";



const TaskID = () => {
    const params = useParams()
    const taskID = params.id

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
    const goToHome = () => {
        navigate('/')
    }
    
    const [taskData, setTaskData] = useState({
        title: "",
        description: ""
    })

    const [code, setCode] = useState("# Введите ваш код здесь")

    useEffect(() => {
        axios.post("http://localhost:5000/api/task/get_task_data", 
            {
                task_id: taskID
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                }
            }
        ).then(response => {
            setTaskData({
                title: response.data.task_title,
                description: response.data.task_description,
            })
        }).catch(error => console.error(error))
    }, [])

    const sendСode = () => {
        axios.post("http://localhost:5000/api/task/code_check",
            {
                code: code,
                task_id: taskID
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
                }
            }
        ).then(response => {
            if (response.data.task_status === true) {
                alert("Task completed Successfully! You may return to your cabinet.")
            } else {
                alert("Task uncompleted! Check your code!")
            }
        }).catch(error =>
            console.error(error)
        )
    }

    return (
        <>
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
            <div id="taskID-container">
                <h1 id="taskID-caption">{taskData.title}</h1>
                <h2 id="taskID-description">{taskData.description}</h2>
                <p>Ваше решение:</p>
                <div id="code-container-wrapper">
                    <CodeMirror
                        id="code-container"
                        value={code}
                        extensions={[python(), lintGutter(), autocompletion()]}
                        onChange={(value) => setCode(value)}
                        options = {{
                            lineNumbers: true,
                            tabSize: 4,
                            indentUnit: 4
                        }}
                    />
                </div>
                <button id="send-button" onClick={sendСode}>
                    Отправить задание
                </button>
            </div>
        </main>
        </>
    )
}

export default TaskID