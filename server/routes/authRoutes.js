/**
 * Router for handling book borrowing-related actions.
 * All routes are protected by authentication middleware.
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { register, login } = require("../controllers/authController");

const router = express.Router();

/**
 * POST /register
 * Registers a new user with provided details (e.g., name, email, password).
 */
router.post("/register", register);

/**
 * POST /login
 * Authenticates a user with email and password and returns a token.
 */
router.post("/login", login);

module.exports = router;
