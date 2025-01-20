const mongoose = require("mongoose");
const validatorApi = require("validator");
const bcrypt = require("bcryptjs");

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.method("checkPassword", async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
});

userSchema.method("changedPasswordAfter", function (JWTTimeStamp) {
  // return true if 'passwordChangedAt' > token issued at
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime();
    console.log(changedTimeStamp, JWTTimeStamp * 1000);
    return changedTimeStamp > JWTTimeStamp * 1000;
  }
  return false;
});
const User = mongoose.model("User", userSchema);

module.exports = User;
