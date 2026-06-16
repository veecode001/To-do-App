import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [celebratingIndex, setCelebratingIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

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
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
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
                {t.text}
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