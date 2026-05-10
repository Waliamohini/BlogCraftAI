import express from "express";
import {
  superAdminSignup,
  superAdminLogin,
  getCompanyWiseBlogCount,
  getRequests,
  approveRequest,
  deleteRequest
} from "../controllers/superAdmin.controller.js";
import { superAdminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ── Public ──────────────────────────────────────────────────────────────────
router.post("/login", superAdminLogin);

// ── Super admin only (requires valid JWT with role: "superadmin") ────────────
// Signup is intentionally protected — only an existing super admin can create another.
// To bootstrap the first super admin, use the one-time seed script or call this
// directly from the server with a trusted client (e.g. Postman on localhost).
router.post("/signup", superAdminAuth, superAdminSignup);

router.get("/company-blogs", superAdminAuth, getCompanyWiseBlogCount);
router.get("/getRequests", superAdminAuth, getRequests);
router.put("/approveRequest/:id", superAdminAuth, approveRequest);
router.delete("/deleteRequest/:id", superAdminAuth, deleteRequest);

export default router;
