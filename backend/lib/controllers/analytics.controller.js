import PostViewModel from '../models/PostViewModel.js';
import Blog from '../models/BlogModel.js';
import Comment from '../models/CommentModel.js';
import EmailModel from '../models/EmailModel.js';
import { generateBlog } from '../config/gemini.js';
import Groq from 'groq-sdk';

// ─── helpers ────────────────────────────────────────────────────────────────

function companyRegex(company) {
  return new RegExp(`^${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
}

function clampDays(raw) {
  const n = parseInt(raw, 10);
  if (n === 7 || n === 90) return n;
  return 30; // default / fallback
}

// ─── trackView ──────────────────────────────────────────────────────────────

export const trackView = async (req, res) => {
  try {
    const { blogId, company, sessionId, email } = req.body;
    if (!blogId || !company || !sessionId) {
      return res
        .status(400)
        .json({ success: false, message: 'blogId, company, and sessionId are required' });
    }

    // Classify viewer type
    let viewerType = 'non_subscriber';
    if (email && email.trim()) {
      const isSubscriber = await EmailModel.exists({
        email: email.trim().toLowerCase(),
        company: companyRegex(company),
      });
      if (isSubscriber) viewerType = 'subscriber';
    }

    // Insert; silently ignore duplicate (unique index on blogId+sessionId)
    try {
      await PostViewModel.create({ blogId, company, sessionId, viewerType });
    } catch (err) {
      if (err.code === 11000) return res.json({ success: true }); // duplicate — ignore
      throw err;
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('[trackView]', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── getViewsOverTime ────────────────────────────────────────────────────────

export const getViewsOverTime = async (req, res) => {
  try {
    const days = clampDays(req.query.days);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const regex = companyRegex(req.company);

    const rows = await PostViewModel.aggregate([
      { $match: { company: regex, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', views: 1, _id: 0 } },
    ]);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('[getViewsOverTime]', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── getViewerBreakdown ──────────────────────────────────────────────────────

export const getViewerBreakdown = async (req, res) => {
  try {
    const regex = companyRegex(req.company);

    const rows = await PostViewModel.aggregate([
      { $match: { company: regex } },
      { $group: { _id: '$viewerType', count: { $sum: 1 } } },
    ]);

    let subscriber = 0;
    let non_subscriber = 0;
    for (const r of rows) {
      if (r._id === 'subscriber') subscriber = r.count;
      else if (r._id === 'non_subscriber') non_subscriber = r.count;
    }

    return res.json({
      success: true,
      data: { subscriber, non_subscriber, total: subscriber + non_subscriber },
    });
  } catch (error) {
    console.error('[getViewerBreakdown]', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── getTopPosts ─────────────────────────────────────────────────────────────

export const getTopPosts = async (req, res) => {
  try {
    const days = clampDays(req.query.days);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const regex = companyRegex(req.company);

    const rows = await PostViewModel.aggregate([
      { $match: { company: regex, createdAt: { $gte: since } } },
      { $group: { _id: '$blogId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: '_id',
          as: 'blog',
        },
      },
      { $unwind: '$blog' },
      {
        $project: {
          blogId: '$_id',
          title: '$blog.title',
          category: '$blog.category',
          slug: '$blog.slug',
          views: 1,
          _id: 0,
        },
      },
    ]);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('[getTopPosts]', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── getCommentTrends ────────────────────────────────────────────────────────

export const getCommentTrends = async (req, res) => {
  try {
    const days = clampDays(req.query.days);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const regex = companyRegex(req.company);

    // Get blog IDs for this company
    const blogs = await Blog.find({ company: regex }).select('_id').lean();
    const blogIds = blogs.map((b) => b._id);

    if (blogIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const rows = await Comment.aggregate([
      { $match: { blog: { $in: blogIds }, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          comments: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', comments: 1, _id: 0 } },
    ]);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('[getCommentTrends]', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── getAiRecommendations ────────────────────────────────────────────────────

export const getAiRecommendations = async (req, res) => {
  try {
    const regex = companyRegex(req.company);

    // Check if company has >= 5 posts with views
    const distinctPosts = await PostViewModel.distinct('blogId', { company: regex });
    if (distinctPosts.length < 5) {
      return res.json({
        success: false,
        message:
          'Not enough data yet. Publish at least 5 posts and accumulate some views before requesting recommendations.',
      });
    }

    // Build context ─────────────────────────────────────────────────────────

    // Top posts with category
    const topPostsRaw = await PostViewModel.aggregate([
      { $match: { company: regex } },
      { $group: { _id: '$blogId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: '_id',
          as: 'blog',
        },
      },
      { $unwind: '$blog' },
      {
        $project: {
          title: '$blog.title',
          category: '$blog.category',
          views: 1,
          titleLength: { $strLenCP: '$blog.title' },
          _id: 0,
        },
      },
    ]);

    // Views by category
    const viewsByCategoryRaw = await PostViewModel.aggregate([
      { $match: { company: regex } },
      {
        $lookup: {
          from: 'blogs',
          localField: 'blogId',
          foreignField: '_id',
          as: 'blog',
        },
      },
      { $unwind: '$blog' },
      { $group: { _id: '$blog.category', views: { $sum: 1 } } },
    ]);
    const viewsByCategory = {};
    for (const r of viewsByCategoryRaw) {
      viewsByCategory[r._id] = r.views;
    }

    // Subscriber ratio
    const breakdown = await PostViewModel.aggregate([
      { $match: { company: regex } },
      { $group: { _id: '$viewerType', count: { $sum: 1 } } },
    ]);
    let subCount = 0;
    let totalCount = 0;
    for (const r of breakdown) {
      totalCount += r.count;
      if (r._id === 'subscriber') subCount = r.count;
    }
    const subscriberRatio = totalCount > 0 ? +(subCount / totalCount).toFixed(4) : 0;

    // Views by day of week
    const byDayRaw = await PostViewModel.aggregate([
      { $match: { company: regex } },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' }, // 1=Sun … 7=Sat
          views: { $sum: 1 },
        },
      },
    ]);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const viewsByDayOfWeek = {};
    for (const r of byDayRaw) {
      viewsByDayOfWeek[dayNames[r._id - 1]] = r.views;
    }

    const context = {
      totalViews: totalCount,
      topPosts: topPostsRaw,
      viewsByCategory,
      subscriberRatio,
      viewsByDayOfWeek,
    };

    // Call Groq ──────────────────────────────────────────────────────────────
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are a content strategy analyst. Based on the following blog performance data, provide 3-5 actionable insights as a JSON array of strings. Each insight should be specific, data-driven, and actionable.

Performance data:
${JSON.stringify(context, null, 2)}

Return ONLY a valid JSON array of strings, like:
["Insight 1...", "Insight 2...", "Insight 3..."]

Do not include any explanation, markdown, or text outside the JSON array.`;

    let recommendations = [];
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a content strategy analyst. Always respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 1024,
      });

      const raw = completion.choices[0]?.message?.content ?? '';

      // Try to parse JSON array
      try {
        // Strip any markdown code fences if present
        const cleaned = raw
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/g, '')
          .trim();
        recommendations = JSON.parse(cleaned);
        if (!Array.isArray(recommendations)) {
          recommendations = [String(recommendations)];
        }
      } catch {
        // Fall back to newline-split
        recommendations = raw
          .split('\n')
          .map((l) => l.replace(/^[-*\d.]+\s*/, '').trim())
          .filter(Boolean);
      }

      if (recommendations.length === 0) {
        return res.json({
          success: false,
          message: 'AI recommendations are temporarily unavailable. Please try again later.',
        });
      }

      return res.json({ success: true, recommendations });
    } catch (aiError) {
      console.error('[getAiRecommendations] Groq error:', aiError.message);
      return res.json({
        success: false,
        message: 'AI recommendations are temporarily unavailable. Please try again later.',
      });
    }
  } catch (error) {
    console.error('[getAiRecommendations]', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
