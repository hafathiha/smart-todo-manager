import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedTheme = JSON.parse(localStorage.getItem("theme"));

    if (savedTasks) setTasks(savedTasks);
    if (savedTheme !== null) setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  const addTask = () => {
    if (!task.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId
            ? { ...t, text: task, priority }
            : t
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: task,
          completed: false,
          priority,
          date: new Date().toLocaleDateString(),
        },
      ]);
    }

    setTask("");
    setPriority("Medium");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed }
          : t
      )
    );
  };

  const editTask = (taskObj) => {
    setTask(taskObj.text);
    setPriority(taskObj.priority);
    setEditId(taskObj.id);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "active") return !t.completed;
      return true;
    })
    .filter((t) =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );

  const completedTasks = tasks.filter(
    (t) => t.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : (completedTasks / tasks.length) * 100;

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        <h1>🚀 Smart To-Do Manager</h1>

        <p className="subtitle">
          ✨ Organize Tasks • Boost Productivity • Achieve Goals ✨
        </p>

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button onClick={addTask}>
            {editId ? "Update Task" : "Add Task"}
          </button>
        </div>

        <input
          className="search"
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters">
          <button onClick={() => setFilter("all")}>
            All
          </button>

          <button onClick={() => setFilter("active")}>
            Active
          </button>

          <button onClick={() => setFilter("completed")}>
            Completed
          </button>
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p style={{ marginBottom: "15px" }}>
          ✅ {completedTasks} of {tasks.length} tasks completed
        </p>

        <ul>
          {filteredTasks.map((t) => (
            <li key={t.id}>
              <div>
                <h3
                  className={
                    t.completed ? "completed" : ""
                  }
                >
                  {t.text}
                </h3>

                <small>
                  📅 Created: {t.date}
                </small>

                <br />

                <span className={t.priority}>
                  {t.priority} Priority
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() =>
                    toggleComplete(t.id)
                  }
                >
                  ✅
                </button>

                <button
                  onClick={() =>
                    editTask(t)
                  }
                >
                  ✏️
                </button>

                <button
                  onClick={() =>
                    deleteTask(t.id)
                  }
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length > 0 && (
          <button
            className="clear-btn"
            onClick={clearCompleted}
          >
            🧹 Clear Completed Tasks
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
