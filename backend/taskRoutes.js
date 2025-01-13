const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("Fetch all tasks");
  })
  .post((req, res) => {
    res.send("Create a task");
  });

router
  .route("/:id")
  .patch((req, res) => {
    res.send("Update a task by id");
  })
  .delete((req, res) => {
    res.send("Delete a task by id");
  });

module.exports = router;
