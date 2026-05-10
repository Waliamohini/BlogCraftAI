"use client";
import React from "react";
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((m) => m.Line),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-3 p-4">
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="h-40 bg-gray-100 rounded" />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
    <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    <p className="text-sm">No comment data yet</p>
  </div>
);

/**
 * CommentTrendChart
 * @param {{ data: Array<{date: string, comments: number}>, loading: boolean, error: string|null }} props
 */
const CommentTrendChart = ({ data = [], loading = false, error = null }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Comment Trends</h3>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center h-48 text-red-400 text-sm">{error}</div>
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              labelStyle={{ color: "#374151" }}
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CommentTrendChart;
