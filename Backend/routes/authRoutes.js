const express = require("express");
const router = express.Router();
const { signUp } = require("../controllers/signupController");
const { login } = require("../controllers/loginController");

// Sign-up Route
router.post("/signup", signUp);

// Login Route
router.post("/login", login);

module.exports = router;
