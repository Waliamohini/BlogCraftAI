"use client";
import React from "react";
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("recharts").then((m) => m.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((m) => m.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((m) => m.Cell),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import("recharts").then((m) => m.Legend),
  { ssr: false }
);

const COLORS = { subscriber: "#6366f1", non_subscriber: "#d1d5db" };

const LoadingSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center gap-3 p-4">
    <div className="w-36 h-36 rounded-full bg-gray-100" />
    <div className="h-3 bg-gray-200 rounded w-24" />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
    <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
    <p className="text-sm">No viewer data yet</p>
  </div>
);

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * ViewerDonutChart
 * @param {{ data: {subscriber: number, non_subscriber: number, total: number}, loading: boolean, error: string|null }} props
 */
const ViewerDonutChart = ({ data = null, loading = false, error = null }) => {
  const chartData =
    data && data.total > 0
      ? [
          { name: "Subscribers", value: data.subscriber, key: "subscriber" },
          { name: "Non-subscribers", value: data.non_subscriber, key: "non_subscriber" },
        ]
      : [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Viewer Breakdown</h3>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center h-48 text-red-400 text-sm">{error}</div>
      ) : chartData.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value.toLocaleString(), name]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-gray-400 mt-1">
            Total: {data.total.toLocaleString()} views
          </p>
        </>
      )}
    </div>
  );
};

export default ViewerDonutChart;
