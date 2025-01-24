const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.createTask = async (req, res, next) => {
  try {
    // Get user from auth token
    const user = await User.findById(req.user._id);
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
    const { tasks } = await User.findById(req.user._id).select("tasks -_id");

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
      result: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    // get user based from auth token
    const user = await User.findById(req.user._id);

    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() === req.params.id
    );

    if (taskIndex === -1)
      throw new AppError("No tasks found with this id", 404);

    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== req.params.id
    );

    await user.save({ validateBeforeSave: false });

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateTask = async (req, res, next) => {
  try {
    // get user based from auth token
    const user = await User.findById(req.user._id);

    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() === req.params.id
    );

    if (taskIndex === -1)
      throw new AppError("No tasks found with this id", 404);

    user.tasks[taskIndex] = Object.assign(user.tasks[taskIndex], req.body);
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
      status: "Success",
      data: {
        task: user.tasks[taskIndex],
      },
    });
  } catch (err) {
    next(err);
  }
};
