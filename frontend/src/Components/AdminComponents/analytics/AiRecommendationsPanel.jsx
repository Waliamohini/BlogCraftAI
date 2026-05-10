"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { baseURL } from "@/config/api";

const LightbulbIcon = () => (
  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/**
 * AiRecommendationsPanel
 * Fetches AI-generated content recommendations and displays them as cards.
 */
const AiRecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // shown when success: false
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setRecommendations([]);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const { data } = await axios.get(`${baseURL}/api/admin/analytics/ai-recommendations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (data.success) {
        setRecommendations(data.recommendations || []);
      } else {
        setMessage(data.message || "AI recommendations are temporarily unavailable.");
      }
    } catch (err) {
      setError("Failed to load AI recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LightbulbIcon />
          <h3 className="text-sm font-semibold text-gray-800">AI Content Recommendations</h3>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Refresh AI recommendations"
        >
          {loading ? (
            <SpinnerIcon />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {loading ? "Generating..." : "Refresh"}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
          <SpinnerIcon />
          <p className="text-sm">Analysing your content performance…</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-400 text-sm py-4">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      ) : message ? (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-700">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {message}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-sm text-gray-400 py-4 text-center">No recommendations available.</div>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-lg p-4"
            >
              <LightbulbIcon />
              <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AiRecommendationsPanel;
