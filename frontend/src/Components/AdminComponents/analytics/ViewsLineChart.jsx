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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <p className="text-sm">No view data yet</p>
  </div>
);

/**
 * ViewsLineChart
 * @param {{ data: Array<{date: string, views: number}>, loading: boolean, error: string|null }} props
 */
const ViewsLineChart = ({ data = [], loading = false, error = null }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Views Over Time</h3>

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
              tickFormatter={(v) => v.slice(5)} // show MM-DD
            />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              labelStyle={{ color: "#374151" }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#6366f1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ViewsLineChart;
