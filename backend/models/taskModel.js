const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: Date,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
