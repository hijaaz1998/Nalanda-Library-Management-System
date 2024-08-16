const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  try {
   return jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
  } catch (error) {
   console.log(error)
  }
};

const generateRefreshToken = (user) => {
  try {
   return jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESG_TOKEN_TOKEN,
      { expiresIn: '7d' }
    );
  } catch (error) {
   console.log(error)
  }
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
   console.log(error)
    return null;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
