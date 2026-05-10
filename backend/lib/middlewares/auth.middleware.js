import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

/**
 * auth — verifies any valid JWT (admin or super admin)
 * Also looks up the admin's company from the database and attaches it as req.company.
 */
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.json({ success: false, message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request

    // Look up the admin's company from the database (trusted source, not client-supplied)
    if (decoded.email) {
      const admin = await Admin.findOne({ email: decoded.email }).select("company");
      if (admin) {
        req.company = admin.company;
      }
    }

    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * superAdminAuth — verifies JWT AND checks role === "superadmin"
 */
export const superAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.json({ success: false, message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied — super admin only" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

export default auth;
