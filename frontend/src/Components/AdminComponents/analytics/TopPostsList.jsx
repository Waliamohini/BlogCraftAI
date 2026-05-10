"use client";
import React from "react";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-3 p-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-5 h-4 bg-gray-200 rounded" />
        <div className="flex-1 h-4 bg-gray-100 rounded" />
        <div className="w-12 h-4 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
    <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p className="text-sm">No post data yet</p>
  </div>
);

/**
 * TopPostsList
 * @param {{ data: Array<{blogId: string, title: string, category: string, slug: string, views: number}>, loading: boolean, error: string|null }} props
 */
const TopPostsList = ({ data = [], loading = false, error = null }) => {
  const maxViews = data.length > 0 ? data[0].views : 1;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Posts</h3>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center h-48 text-red-400 text-sm">{error}</div>
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <ol className="space-y-3">
          {data.map((post, idx) => (
            <li key={post.blogId || idx} className="flex items-center gap-3">
              {/* Rank */}
              <span className="text-xs font-bold text-gray-400 w-5 text-right flex-shrink-0">
                {idx + 1}
              </span>

              {/* Title + bar */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium truncate" title={post.title}>
                  {post.title}
                </p>
                <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((post.views / maxViews) * 100)}%` }}
                  />
                </div>
              </div>

              {/* View count */}
              <span className="text-xs font-semibold text-indigo-600 flex-shrink-0 w-14 text-right">
                {post.views.toLocaleString()} views
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default TopPostsList;
