import jwt from 'jsonwebtoken'
import Blog from '../models/BlogModel.js';
import Comment from '../models/CommentModel.js';
import EmailModel from '../models/EmailModel.js';
import redis from '../config/redis.js';
import Admin from '../models/adminModel.js'
import Request from "../models/requestModel.js"


export const adminSignup = async (req, resp) => {
  try {
    const Data = req.body;

    if (!Data.company || !Data.email || !Data.password) {
      return resp
        .status(400)
        .json({ error: "Company, email, or password is missing" });
    }

    // First check if the company has a request at all (any status)
    const escapedCompany = Data.company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const anyRequest = await Request.findOne({
      company: new RegExp(`^${escapedCompany}$`, "i"),
    });

    console.log("🔎 Matched request:", anyRequest);

    if (!anyRequest) {
      return resp.status(404).json({
        warning: "No request found for this company. Make sure the company name matches exactly as submitted in your access request.",
      });
    }

    if (anyRequest.status.toLowerCase() === "pending") {
      return resp.json({ warning: "Your company request is still pending approval. Please wait for super admin approval." });
    }

    if (anyRequest.status.toLowerCase() === "rejected") {
      return resp.json({ warning: "Your company request was rejected. Please contact support for more information." });
    }

    // Check if admin already exists for this email
    const existingAdmin = await Admin.findOne({ email: Data.email });
    if (existingAdmin) {
      return resp.status(409).json({ warning: "An account with this email already exists. Please sign in instead." });
    }

    const newAdmin = await Admin.create({
      company: anyRequest.company,
      email: Data.email,
      password: Data.password,
    });

    return resp.status(201).json({
      success: true,
      message: `Account created successfully for ${anyRequest.company}!`,
    });
  } catch (error) {
    console.error("adminSignup error:", error);
    return resp.status(500).json({ error: "Internal server error" });
  }
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (!password || admin.password !== password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const company = admin.company;
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const { company } = req.query;
    const filter = company
      ? { company: new RegExp(`^${company}$`, 'i') }
      : {};

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, blogs, company: company || 'all' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getAllComments = async (req, res) => {
  try {
    // Use req.company set by auth middleware (trusted); fall back to query param for compatibility
    const company = req.company || req.query.company;

    const allComments = await Comment.find({}).populate("blog").sort({ createdAt: -1 });

    // Filter to only comments whose associated blog belongs to this company (case-insensitive)
    const comments = company
      ? allComments.filter(
          (c) =>
            c.blog &&
            c.blog.company &&
            c.blog.company.toLowerCase() === company.toLowerCase()
        )
      : allComments;

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getDashboard = async (req, res) => {
  try {
    // Use req.company set by auth middleware (trusted); fall back to query param for compatibility
    const company = req.company || req.query.company;

    const companyFilter = company
      ? { company: new RegExp(`^${company}$`, 'i') }
      : {};

    const recentBlogs = await Blog.find(companyFilter).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments(companyFilter);
    const drafts = await Blog.countDocuments({ ...companyFilter, isPublished: false });

    // Count only comments on blog posts belonging to this company (task 1.5)
    let comments;
    if (company) {
      const companyBlogIds = await Blog.find(companyFilter).distinct('_id');
      comments = await Comment.countDocuments({ blog: { $in: companyBlogIds } });
    } else {
      comments = await Comment.countDocuments();
    }

    const companyCounts = await Blog.aggregate([
      { $group: { _id: "$company", count: { $sum: 1 } } }
    ]);
    const companyBlogCounts = {};
    companyCounts.forEach(item => {
      companyBlogCounts[item._id] = item.count;
    });

    const dashboardData = {
      blogs, comments, drafts, recentBlogs,
      companyBlogCounts
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getAllEmails = async (req, res) => {
  try {
    // Use req.company set by auth middleware (trusted); fall back to query param for compatibility
    const company = req.company || req.query.company;

    const query = company
      ? { company: new RegExp(`^${company}$`, 'i') }
      : {};

    const emails = await EmailModel.find(query).sort({ date: -1 });
    res.json({ success: true, emails });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const deleteEmailById = async (req, res) => {
  try {
    const { id } = req.query;
    await EmailModel.findByIdAndDelete(id);
    res.json({ success: true, msg: "Email deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const updatePassword = async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ success: false, msg: "Email and password are required" });
    }

    const result = await Admin.updateOne(
      { email: email },
      { $set: { password: password } }
    );

    if (result.matchedCount === 0) {
      return resp.status(404).json({ success: false, msg: "User not found" });
    }

    return resp.json({ success: true, msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ success: false, msg: "Server error" });
  }
};
