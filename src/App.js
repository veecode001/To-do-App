import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [celebratingIndex, setCelebratingIndex] = useState(null);

  const addTask = () => {
    if (task === '') return;
    setTasks([...tasks, { text: task, completed: false, deadline: '' }]);
    setTask('');
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const setDeadline = (index, date) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, deadline: date } : t
    );
    setTasks(updatedTasks);
  };

  const finishTask = (index) => {
    setCelebratingIndex(index);

    setTimeout(() => {
      setTasks((currentTasks) => currentTasks.filter((_, i) => i !== index));
      setCelebratingIndex(null);
    }, 3000);
  };

  return (
    <div className="container">
      <h1>My Task Manager</h1>
      <div className="input-row">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            <span
              className={`task-text ${t.completed ? 'completed' : ''}`}
              onClick={() => toggleComplete(index)}
            >
              {t.text}
            </span>

            {t.deadline && <span className="deadline-text">📅 {t.deadline}</span>}

            {celebratingIndex === index ? (
              <span className="celebration">👏 👍</span>
            ) : (
              <>
                <input
                  type="datetime-local"
                  className="deadline-input"
                  value={t.deadline}
                  onChange={(e) => setDeadline(index, e.target.value)}
                />
                <button className="done-btn" onClick={() => finishTask(index)}>
                  Task Done
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;