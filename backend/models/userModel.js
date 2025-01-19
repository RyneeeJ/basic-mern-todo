const mongoose = require("mongoose");
const validatorApi = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "A valid email is required"],
    validate: {
      validator: validatorApi.isEmail,
      message: "Please use a valid email address",
    },
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      message: "Passwords do not match",
    },
  },
});

const User = new User("User", userSchema);

module.exports = User;
