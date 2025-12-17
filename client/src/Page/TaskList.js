import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "../Component/TaskFrom";
import TaskItem from "../Component/TaskItem";
import "./TaskList.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, todo, in-progress, completed

  useEffect(() => {
    fetchTasks();
  }, []);

  // In the fetchTasks function, change to:
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } else {
        alert("Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <div className="task-header">
        <h1>My Tasks 📋</h1>
        <div className="task-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card todo">
            <span className="stat-number">{stats.todo}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="stat-card in-progress">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="task-controls">
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All Tasks
          </button>
          <button
            className={filter === "todo" ? "active" : ""}
            onClick={() => setFilter("todo")}
          >
            To Do ({stats.todo})
          </button>
          <button
            className={filter === "in-progress" ? "active" : ""}
            onClick={() => setFilter("in-progress")}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      <div className="task-content">
        <div className="task-form-section">
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>

        <div className="tasks-section">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No tasks found</h3>
              <p>
                {filter === "all"
                  ? "Create your first task to get started!"
                  : `No ${filter.replace("-", " ")} tasks`}
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={handleTaskDeleted}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
