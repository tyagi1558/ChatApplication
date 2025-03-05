const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const bearer = token.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(bearer[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
