import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Protect routes: require valid access token
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No access token" });

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach user info to request
    req.user = { id: payload.id, role: payload.role };

    // Optional: fetch full user object
    // req.userObj = await User.findById(payload.id).select("-password");

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// Admin only shortcut
export const adminOnly = authorize("admin", "superadmin");
