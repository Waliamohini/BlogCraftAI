"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { baseURL } from "@/config/api";
import ViewsLineChart from "./ViewsLineChart";
import ViewerDonutChart from "./ViewerDonutChart";
import TopPostsList from "./TopPostsList";
import CommentTrendChart from "./CommentTrendChart";
import AiRecommendationsPanel from "./AiRecommendationsPanel";

const DAYS_OPTIONS = [7, 30, 90];

/**
 * Pad a sparse date array with zero-value entries so the chart has a
 * continuous x-axis for the selected date range.
 */
function padDates(data, days, valueKey) {
  const map = {};
  for (const row of data) {
    map[row.date] = row[valueKey];
  }

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    result.push({ date: dateStr, [valueKey]: map[dateStr] ?? 0 });
  }
  return result;
}

const initialState = { data: null, loading: true, error: null };

/**
 * AnalyticsSection
 * Fetches all analytics data and renders the four charts + AI panel.
 */
const AnalyticsSection = () => {
  const [days, setDays] = useState(30);

  const [views, setViews] = useState(initialState);
  const [breakdown, setBreakdown] = useState(initialState);
  const [topPosts, setTopPosts] = useState(initialState);
  const [comments, setComments] = useState(initialState);

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAll = useCallback(async (selectedDays) => {
    const headers = getHeaders();

    // Reset loading states independently
    setViews((s) => ({ ...s, loading: true, error: null }));
    setBreakdown((s) => ({ ...s, loading: true, error: null }));
    setTopPosts((s) => ({ ...s, loading: true, error: null }));
    setComments((s) => ({ ...s, loading: true, error: null }));

    // Fire all four requests in parallel; each handles its own error
    const [viewsRes, breakdownRes, topPostsRes, commentsRes] = await Promise.allSettled([
      axios.get(`${baseURL}/api/admin/analytics/views-over-time?days=${selectedDays}`, { headers }),
      axios.get(`${baseURL}/api/admin/analytics/viewer-breakdown`, { headers }),
      axios.get(`${baseURL}/api/admin/analytics/top-posts?days=${selectedDays}`, { headers }),
      axios.get(`${baseURL}/api/admin/analytics/comment-trends?days=${selectedDays}`, { headers }),
    ]);

    // Views over time
    if (viewsRes.status === "fulfilled" && viewsRes.value.data.success) {
      setViews({
        data: padDates(viewsRes.value.data.data, selectedDays, "views"),
        loading: false,
        error: null,
      });
    } else {
      setViews({ data: [], loading: false, error: "Failed to load views data" });
    }

    // Viewer breakdown
    if (breakdownRes.status === "fulfilled" && breakdownRes.value.data.success) {
      setBreakdown({ data: breakdownRes.value.data.data, loading: false, error: null });
    } else {
      setBreakdown({ data: null, loading: false, error: "Failed to load breakdown data" });
    }

    // Top posts
    if (topPostsRes.status === "fulfilled" && topPostsRes.value.data.success) {
      setTopPosts({ data: topPostsRes.value.data.data, loading: false, error: null });
    } else {
      setTopPosts({ data: [], loading: false, error: "Failed to load top posts" });
    }

    // Comment trends
    if (commentsRes.status === "fulfilled" && commentsRes.value.data.success) {
      setComments({
        data: padDates(commentsRes.value.data.data, selectedDays, "comments"),
        loading: false,
        error: null,
      });
    } else {
      setComments({ data: [], loading: false, error: "Failed to load comment data" });
    }
  }, []);

  useEffect(() => {
    fetchAll(days);
  }, [days, fetchAll]);

  return (
    <section className="mt-10">
      {/* Section header + days selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900">Analytics</h2>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                days === d
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <ViewsLineChart data={views.data ?? []} loading={views.loading} error={views.error} />
        <ViewerDonutChart data={breakdown.data} loading={breakdown.loading} error={breakdown.error} />
        <TopPostsList data={topPosts.data ?? []} loading={topPosts.loading} error={topPosts.error} />
        <CommentTrendChart data={comments.data ?? []} loading={comments.loading} error={comments.error} />
      </div>

      {/* AI Recommendations */}
      <AiRecommendationsPanel />
    </section>
  );
};

export default AnalyticsSection;
