const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/passwordUtil");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtil");

/**
 * Registers a new user.
*/

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Encrypt the user's password
    const encryptedPassword = await hashPassword(password);

    // Create a new user instance
    const user = new User({
      name,
      email,
      password: encryptedPassword,
      role,
    });

    // Save the new user to the database
    await user.save();

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    // Respond with server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
  Authenticates a user and generates tokens.
*/

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the user record
    user.refreshToken = refreshToken;
    await user.save();

    // Respond with success and tokens
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    // Respond with server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
};
