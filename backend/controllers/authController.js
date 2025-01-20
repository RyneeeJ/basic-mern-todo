const { promisify } = require("util");
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

exports.protect = async (req, res, next) => {
  try {
    // check if there is a jwt token in request headers
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ").at(1);
    }

    // If no token, prevent access by throwing error
    if (!token)
      throw new AppError(
        "You are not authorized to access this resource. Please log in first",
        401
      );

    // Check if token is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      throw new AppError("The user who owned this token no longer exist", 401);

    // check if the user recently changed password after the token was issued
    const changedPasswordAfter = currentUser.changedPasswordAfter(decoded.iat);
    if (changedPasswordAfter)
      throw new AppError(
        "User recently changed password. Please log in again",
        401
      );

    req.user = currentUser;

    next();
  } catch (err) {
    next(err);
  }
};
