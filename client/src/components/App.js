import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../index.css';
import Home from './Home/Home.js';
import Registration from './Registration/Registration.js';
import Login from './Login/Login.js';
import Profile from './Profile/Profile.js';
import Tasks from './Tasks/Tasks.js';
import Task from './Task/Task.js';
import News from './News/News.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/registration" element={<Registration />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/task" element={<Task />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;
