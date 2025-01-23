// const Task = require("../models/taskModel");

const User = require("../models/userModel");

exports.createTask = async (req, res, next) => {
  try {
    // Get user from auth token
    const user = await User.findByIdAndUpdate(req.user._id);
    // insert task to user's tasks property
    user.tasks.push(req.body);
    await user.save({ validateModifiedOnly: true });

    res.status(201).json({
      status: "Success",
      data: {
        task: user.tasks.at(-1),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    // get user's tasks (along with isOverdue virtual prop) based from auth token a
    const tasks = await User.findById(req.user._id).select("tasks");

    // Tried using aggregation pipeline to get use tasks with isOverdue prop computed dynamically
    /*
    const tasks = await User.aggregate([
      {
        $project: {
          _id: 0,
          tasks: {
            $map: {
              input: "$tasks",
              as: "todo",
              in: {
                $mergeObjects: [
                  "$$todo",
                  {
                    isOverdue: {
                      $cond: [
                        {
                          $and: [
                            { $ifNull: ["$$todo.dueDate", false] },
                            { $lt: ["$$todo.dueDate", new Date()] },
                          ], // Check if dueDate is in the past
                        },
                        true,
                        false,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    */
    res.status(200).json({
      status: "Success",
      data: {
        tasks,
      },
    });
  } catch (err) {
    next(err);
  }
};

/*
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
*/
