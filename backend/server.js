/* eslint-disable no-console */
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.all("*", (req, res, next) => {
  const error = new AppError(`This page ${req.url} does not exist`, 404);
  next(error);
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
