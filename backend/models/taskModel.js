const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (val) {
          return val >= Date.now();
        },
        message: "Due date must be at least today or in the future",
      },
    },
  },
  {
    strictQuery: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
