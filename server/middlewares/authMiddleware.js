const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Autherization denied" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    console.log("iiiiii",decoded)
    req.user = decoded.userId;
    next();
  } catch (error) {
   res.status(500).json({success: false, message: 'Internal server error'})
  }
};

module.exports = authMiddleware