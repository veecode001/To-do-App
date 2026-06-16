import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [celebratingIndex, setCelebratingIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setTasks((currentTasks) =>
        currentTasks.map((t) => {
          if (t.deadline && !t.completed) {
            const deadlineTime = new Date(t.deadline);
            if (now >= deadlineTime) {
              playAlarmSound();
              showNotification(t.text);
              return { ...t, overdue: true };
            }
          }
          return t;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const playAlarmSound = () => {
    const audio = new Audio(
      'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
    );
    audio.play();
  };

  const showNotification = (taskText) => {
    if (Notification.permission === 'granted') {
      new Notification('Task Deadline Reached!', {
        body: taskText,
        icon: '🔔',
      });
    }
  };

  const addTask = () => {
    if (task === '') return;
    setTasks([
      ...tasks,
      { text: task, completed: false, deadline: '', alerted: false, overdue: false },
    ]);
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
      i === index ? { ...t, deadline: date, alerted: false, overdue: false } : t
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

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index, currentText) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  const saveEdit = (index) => {
    if (editText.trim() === '') return;
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, text: editText } : t
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditText('');
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
              e.preventDefault();
              addTask();
            }
          }}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((t, index) => (
          <li key={index} className={t.overdue ? 'overdue' : ''}>
            {editingIndex === index ? (
              <input
                type="text"
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <span
                className={`task-text ${t.completed ? 'completed' : ''}`}
                onClick={() => toggleComplete(index)}
              >
                {t.overdue ? '🔔 ' : ''}{t.text}
              </span>
            )}

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

                {editingIndex === index ? (
                  <button className="save-btn" onClick={() => saveEdit(index)}>
                    Save
                  </button>
                ) : (
                  <button className="edit-btn" onClick={() => startEditing(index, t.text)}>
                    Edit
                  </button>
                )}

                <button className="done-btn" onClick={() => finishTask(index)}>
                  Done
                </button>
                <button className="delete-btn" onClick={() => deleteTask(index)}>
                  Delete
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