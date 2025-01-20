const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
