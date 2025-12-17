import { useState } from "react";
import axios from "axios";
import "./TaskForm.css";

function TaskForm({ onTaskAdded }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/tasks", task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskAdded(res.data.task);
      setTask({ title: "", description: "", priority: "medium", dueDate: "" });
    } catch (error) {
      alert("Failed to create task");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>➕ Add New Task</h3>
      <input
        type="text"
        placeholder="Task title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <select
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <input
        type="date"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
