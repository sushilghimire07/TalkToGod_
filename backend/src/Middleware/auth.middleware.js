import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
// check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // match the key you used when signing (userID not userId)
    const user = await User.findById(decoded.userID).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
// attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
