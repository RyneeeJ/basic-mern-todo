const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

    res.status(201).json({
      status: "Success",
      token,
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};
