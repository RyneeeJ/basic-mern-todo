const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

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

exports.forgotPassword = async (req, res, next) => {
  try {
    // Get user via email
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      throw new AppError(
        "There is no user associated with this email address",
        404
      );

    // Create reset password token
    const resetToken = user.createResetPasswordToken();

    await user.save({ validateBeforeSave: false });
    // Send password reset link via email

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${resetToken}`;

    const mailOptions = {
      receiver: req.body.email,
      subject: "Password Reset Link (valid for 10 min)",
      message: `Forgot your password? Click this password reset link to reset your password: ${resetUrl}.\nPlease ignore this email if you did not forget your password.`,
    };

    try {
      await sendEmail(mailOptions);

      res.status(200).json({
        status: "Success",
        message: "Password reset link has been sent to your email!",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(
        "There was a problem sending the reset link to your email",
        500
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // get user based on token and token mus not be expired: passwordResetExpires > Date.now()
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new AppError("Token is invalid or has expired", 404);

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: "Success",
      token,
      message: "Password reset successfully!",
    });
  } catch (err) {
    next(err);
  }
};
