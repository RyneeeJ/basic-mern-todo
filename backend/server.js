/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");
const globalErrorHandler = require("./controllers/errorController");
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
  res.status(404).json({
    status: "fail",
    message: "This page does not exist",
  });
});

app.use(globalErrorHandler);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
