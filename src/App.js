import Auth from './Auth';
import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        fetchTasks(data.session.user.id);
      }
    };
    getSession();
  }, []);

const fetchTasks = async (userId) => {
  const { data, error } = await supabase
    .from('Tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
  } else {
    setTasks(data);
  }
};
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

  const addTask = async () => {
    if (task === '') return;

    const { data, error } = await supabase
      .from('Tasks')
      .insert([{ text: task, completed: false, user_id: user.id }])
      .select();

    if (error) {
      console.error('Error adding task:', error);
    } else {
     setTasks([...tasks, data[0]]);
      setTask('');
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    const { error } = await supabase
      .from('Tasks')
      .update({ completed: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(tasks.map((t) =>
        t.id === id ? { ...t, completed: !currentStatus } : t
      ));
    }
  };

  const setDeadline = async (id, date) => {
    const { error } = await supabase
      .from('Tasks')
      .update({ deadline: date, overdue: false })
      .eq('id', id);

    if (error) {
      console.error('Error setting deadline:', error);
    } else {
      setTasks(tasks.map((t) =>
        t.id === id ? { ...t, deadline: date, overdue: false } : t
      ));
    }
  };

  const finishTask = (id, index) => {
    setCelebratingIndex(index);

    setTimeout(async () => {
      const { error } = await supabase
        .from('Tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error finishing task:', error);
      } else {
        setTasks((currentTasks) => currentTasks.filter((t) => t.id !== id));
      }
      setCelebratingIndex(null);
    }, 3000);
  };

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('Tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const startEditing = (index, currentText) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  const saveEdit = async (id) => {
    if (editText.trim() === '') return;

    const { error } = await supabase
      .from('Tasks')
      .update({ text: editText })
      .eq('id', id);

    if (error) {
      console.error('Error saving edit:', error);
    } else {
      setTasks(tasks.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      ));
      setEditingIndex(null);
      setEditText('');
    }
  };

  if (!user) {
    return (
      <Auth
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          fetchTasks(loggedInUser.id);
        }}
      />
    );
  }

return (
  <>
    <button
      className="logout-btn"
      onClick={async () => {
        await supabase.auth.signOut();
        setUser(null);
        setTasks([]);
      }}
    >
      Log Out
    </button>

    <div className="background-decor">
      <span className="bg-item q1 script-1">Get it done.</span>
      <span className="bg-item q2 script-2">One task at a time.</span>
      <span className="bg-item q3 script-2">Stay focused.</span>
      <span className="bg-item q4">Small steps win.</span>
      <span className="bg-item q5 script-3">Done is better than perfect.</span>
      <span className="bg-item q6">Make today count.</span>
      <span className="bg-item q7 script-1">Progress, not perfection.</span>
      <span className="bg-item q8">Just start.</span>
      <span className="bg-item q9 script-2">Keep going.</span>
      <span className="bg-item q10">You've got this.</span>
      <span className="bg-item q11 script-3">You can do it!</span>
      <span className="bg-item q12">Just do it.</span>
      <span className="bg-item q13 script-1">Get up and go.</span>
      <span className="bg-item q14">Today is gonna be a great day.</span>
      <span className="bg-item q15 script-2">Get up and go!.</span>
      <span className="bg-item q16">One choice can change everything.</span>
      <span className="bg-item q17 script-3">One day at a time.</span>
      <span className="bg-item q18 script-3">Don't you dare proscrastinate.</span>
      <span className="bg-item q19 script-1">Don't be the same, be better.</span>
      <span className="bg-item q20">Trust the process.</span>
      <span className="bg-item q21 script-2">You are your best thing!</span>
      <span className="bg-item q22">You're your best bet!.</span>
      <span className="bg-item q23 script-3">Nothing changes if nothing changes.</span>
      <span className="bg-item q24">Small habits, big outcomes.</span>
      <span className="bg-item q25 script-1">Make that call today!.</span>
      <span className="bg-item q26">Send that email today!</span>
      <span className="bg-item q27 script-2">Smile, life's beautiful.</span>
      <span className="bg-item q28">Make today amazing.</span>
      <span className="bg-item q29 script-3">You are your only limit.</span>
      <span className="bg-item q30">Be yourself!.</span>
      <span className="bg-item q31">Dream big, start small.</span>
      <span className="bg-item q32 script-3">Discipline over motivation.</span>
      <span className="bg-item q33 script-2">Stay consistent.</span>
      <span className="bg-item q34">Your future self will thank you.</span>
      <span className="bg-item q35 script-3">Win the day.</span>

      <span className="bg-item icon1">✅</span>
      <span className="bg-item icon2">📋</span>
      <span className="bg-item icon3">📅</span>
      <span className="bg-item icon4">⏰</span>
      <span className="bg-item icon5">✏️</span>
      <span className="bg-item icon6">🎯</span>
      <span className="bg-item icon7">📌</span>
      <span className="bg-item icon8">🚀</span>
      <span className="bg-item icon9">💐</span>
      <span className="bg-item icon10">🌞</span>
      <span className="bg-item icon11">💝</span>
      <span className="bg-item icon12">☎️</span>
      <span className="bg-item icon13">📝</span>
      <span className="bg-item icon14">🆙</span>
      <span className="bg-item icon15">🤸🏻‍♀️</span>
      <span className="bg-item icon16">🆗</span>
      <span className="bg-item icon17">✍🏻</span>
      <span className="bg-item icon18">✨</span>
      <span className="bg-item icon19">🦾</span>
      <span className="bg-item icon20">🥇</span>
      <span className="bg-item icon21">📈</span>
      <span className="bg-item icon22">🔥</span>
      <span className="bg-item icon23">💡</span>
      <span className="bg-item icon24">🧠</span>
      <span className="bg-item icon25">📖</span>
      <span className="bg-item icon26">🏆</span>
      <span className="bg-item icon27">🔔</span>
      <span className="bg-item icon28">📊</span>
      <span className="bg-item icon29">🌟</span>
      <span className="bg-item icon30">🕐</span>
    </div>

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
                onClick={() => toggleComplete(t.id, t.completed)}
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
                  onChange={(e) => setDeadline(t.id, e.target.value)}
                />

                {editingIndex === index ? (
                  <button className="save-btn" onClick={() => saveEdit(t.id)}>
                    Save
                  </button>
                ) : (
                  <button className="edit-btn" onClick={() => startEditing(index, t.text)}>
                    Edit
                  </button>
                )}

                <button className="done-btn" onClick={() => finishTask(t.id, index)}>
                  Done
                </button>
                <button className="delete-btn" onClick={() => deleteTask(t.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  </>
  );
}

export default App;