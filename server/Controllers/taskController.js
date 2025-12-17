const pool = require("../config/database");

const taskController = {
  // Get all tasks for current user
  getAllTasks: async (req, res) => {
    try {
      const userId = req.user.userId;
      const [tasks] = await pool.execute(
        "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      res.json({ tasks });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Create a new task
  createTask: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { title, description, priority, dueDate } = req.body;

      const [result] = await pool.execute(
        "INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)",
        [userId, title, description, priority || "medium", dueDate]
      );

      const [newTask] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [
        result.insertId,
      ]);

      res.status(201).json({
        message: "Task created successfully",
        task: newTask[0],
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Update a task
  updateTask: async (req, res) => {
    try {
      const userId = req.user.userId;
      const taskId = req.params.id;
      const { title, description, priority, status, dueDate } = req.body;

      // First check if task belongs to user
      const [task] = await pool.execute(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        [taskId, userId]
      );

      if (task.length === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Update task
      await pool.execute(
        `UPDATE tasks 
         SET title = ?, description = ?, priority = ?, status = ?, due_date = ?
         WHERE id = ? AND user_id = ?`,
        [
          title || task[0].title,
          description || task[0].description,
          priority || task[0].priority,
          status || task[0].status,
          dueDate || task[0].due_date,
          taskId,
          userId,
        ]
      );

      // Get updated task
      const [updatedTask] = await pool.execute(
        "SELECT * FROM tasks WHERE id = ?",
        [taskId]
      );

      res.json({
        message: "Task updated successfully",
        task: updatedTask[0],
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete task - FIXED TYPOS!
  deleteTask: async (req, res) => {
    try {
      const userId = req.user.userId; // Fixed: req (not res)
      const taskId = req.params.id; // Fixed: req (not res)

      const [result] = await pool.execute(
        `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
        [taskId, userId]
      );

      if (result.affectedRows === 0) {
        // Fixed: affectedRows (not affectedrow)
        return res.status(404).json({ message: "Task not found" }); // Fixed: 404 (not 500)
      }

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Toggle status - FIXED TYPOS!
  toggleStatus: async (req, res) => {
    try {
      const userId = req.user.userId; // Fixed: req (not res)
      const taskId = req.params.id; // Fixed: req (not res)
      const { status } = req.body;

      await pool.execute(
        `UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?`,
        [status, taskId, userId] // Fixed: taskId (not id)
      );

      res.json({ message: "Task status updated" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = taskController;
