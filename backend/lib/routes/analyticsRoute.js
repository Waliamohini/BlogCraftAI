import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import {
  getViewsOverTime,
  getViewerBreakdown,
  getTopPosts,
  getCommentTrends,
  getAiRecommendations,
} from '../controllers/analytics.controller.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/views-over-time', auth, getViewsOverTime);
analyticsRouter.get('/viewer-breakdown', auth, getViewerBreakdown);
analyticsRouter.get('/top-posts', auth, getTopPosts);
analyticsRouter.get('/comment-trends', auth, getCommentTrends);
analyticsRouter.get('/ai-recommendations', auth, getAiRecommendations);

export default analyticsRouter;
