const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/passwordUtil");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtil");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUSer = await User.findOne({ email });

    if (existingUSer)
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });

    const encryptedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: encryptedPassword,
      role
    });

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({success: true, message: 'login successfull', accessToken, refreshToken})
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

module.exports = {
  register,
  login,
};
