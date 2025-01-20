const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");
router
  .route("/")
  .get(authController.protect, taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
