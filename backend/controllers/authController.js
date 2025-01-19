const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "Success",
      token,
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new AppError("Both email and password are required", 400);

    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    const passwordCorrect = await user?.checkPassword(password);

    if (!user || !passwordCorrect)
      throw new AppError("Incorrect email or password", 401);

    const token = signToken(user.id);
    res.status(200).json({
      status: "Success",
      token,
      message: "Logged in successfully",
    });
  } catch (err) {
    next(err);
  }
};
