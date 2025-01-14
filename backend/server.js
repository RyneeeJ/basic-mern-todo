/* eslint-disable no-console */
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const taskRoutes = require("./routes/taskRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/tasks", taskRoutes);

app.all("*", (req, res, next) => {
  const error = new AppError(`This page ${req.url} does not exist`, 404);
  next(error);
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
