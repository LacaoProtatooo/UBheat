import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticatedUser = async (req, res, next) => {
    try {
      const { token } = req.cookies || {};
      if (!token) {
        return res.status(401).json({ success: false, message: "Please log in to access this resource." });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user.id);
      if (!req.user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({ success: false, message: "Authentication failed. Please log in again." });
    }
  };

// Middleware to allow only admin users
export const authorizeAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Only admins are authorized to access this resource.",
        });
    }
    next(); // Proceed if the user is an admin
};