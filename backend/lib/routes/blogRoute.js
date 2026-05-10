import express from "express";
import { subscribeEmail, request, addBlog, addComment, deleteBlogById, generateContent, refineContent, getAllBlogs, getBlogById, getBlogComments, togglePublish, getBlogBySlug } from "../controllers/blog.controller.js";
import { trackView } from "../controllers/analytics.controller.js";
import upload from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import cachedData from "../middlewares/redis.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), auth, addBlog);
blogRouter.get('/all', cachedData("blogs"),  getAllBlogs);
blogRouter.get('/slug/:slug', getBlogBySlug);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', cachedData("comments"), getBlogComments);
blogRouter.post('/request', request);
blogRouter.post('/generate', auth, generateContent);
blogRouter.post('/refine', auth, refineContent);
blogRouter.post('/subscribe', subscribeEmail);
blogRouter.post('/track-view', trackView);

export default blogRouter;