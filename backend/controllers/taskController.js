const Task = require("../models/taskModel");

exports.createTask = async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json({
      status: "Success",
      data: newTask,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({}).sort("createdAt");
    res.status(200).json({
      status: "Success",
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({
        status: "fail",
        message: "This task does not exist",
      });
    }
    res.status(200).json({
      status: "Success",
      data: updatedTask,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
