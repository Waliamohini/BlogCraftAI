import express from "express";
import {
  updatePassword,
  adminSignup,
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getDashboard,
  getAllEmails,
  deleteEmailById
} from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

// ── Public ───────────────────────────────────────────────────────────────────
adminRouter.post("/login", adminLogin);
adminRouter.post("/signUp", adminSignup);          // requires approved company

// ── Authenticated (valid JWT required) ───────────────────────────────────────
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.post("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveCommentById);
adminRouter.get("/dashboard", auth, getDashboard);
adminRouter.get("/emails", auth, getAllEmails);
adminRouter.delete("/emails", auth, deleteEmailById);
adminRouter.put("/updatePassword", auth, updatePassword);  // was unprotected

export default adminRouter;
