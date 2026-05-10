import mongoose from 'mongoose';

const postViewSchema = new mongoose.Schema(
  {
    blogId:     { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
    company:    { type: String, required: true },
    sessionId:  { type: String, required: true },
    viewerType: { type: String, enum: ['subscriber', 'non_subscriber'], required: true },
  },
  { timestamps: true }
);

// Enforce one view per (blog, session) pair at the DB level
postViewSchema.index({ blogId: 1, sessionId: 1 }, { unique: true });
// Fast company + date-range aggregation queries
postViewSchema.index({ company: 1, createdAt: -1 });

export default mongoose.models?.PostView
  || mongoose.model('PostView', postViewSchema);
