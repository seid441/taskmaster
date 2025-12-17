const { Router } = require("express"); // Fixed: Capital R
const router = Router();
const taskController = require("../controllers/taskController"); // Fixed: lowercase controllers
const authMiddleware = require("../middleware/auth"); // Fixed: lowercase middleware

// All task routes require authentication
router.use(authMiddleware); // Fixed: removed quotes

// Task routes
router.get("/", taskController.getAllTasks); // Fixed: getAllTasks (not getAllTaks)
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask); // Fixed: PUT (not POST)
router.delete("/:id", taskController.deleteTask); // Fixed: DELETE (not POST)
router.patch("/:id/status", taskController.toggleStatus); // Fixed: PATCH (not POST)

module.exports = router;
