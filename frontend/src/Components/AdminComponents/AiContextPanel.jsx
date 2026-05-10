"use client";
import React from "react";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "authoritative", label: "Authoritative" },
  { value: "educational", label: "Educational" },
  { value: "persuasive", label: "Persuasive" },
];

const lengths = [
  { value: "short", label: "Short", desc: "~400 words" },
  { value: "medium", label: "Medium", desc: "~800 words" },
  { value: "long", label: "Long", desc: "~1500 words" },
];

const stylePresets = [
  { value: "", label: "No preference" },
  { value: "Neil Patel", label: "Neil Patel" },
  { value: "HBR", label: "Harvard Business Review" },
  { value: "McKinsey", label: "McKinsey & Company" },
  { value: "Gartner", label: "Gartner" },
  { value: "Forrester", label: "Forrester" },
];

/**
 * AiContextPanel
 * Props:
 *   ctx        — { tone, length, audience, style, keywords, extraContext }
 *   setCtx     — setter
 *   onGenerate — called when user clicks Generate
 *   loading    — bool
 *   disabled   — bool (no title entered yet)
 */
export default function AiContextPanel({ ctx, setCtx, onGenerate, loading, disabled }) {
  const set = (key) => (e) => setCtx((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800">AI Generation Settings</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
          Powered by Llama 3.3
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Tone */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tone of Voice
          </label>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setCtx((prev) => ({ ...prev, tone: t.value }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  ctx.tone === t.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Length */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Blog Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {lengths.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setCtx((prev) => ({ ...prev, length: l.value }))}
                className={`flex flex-col items-center py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                  ctx.length === l.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                <span className="font-semibold">{l.label}</span>
                <span className={`mt-0.5 ${ctx.length === l.value ? "text-indigo-200" : "text-gray-400"}`}>
                  {l.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Target Audience
          </label>
          <input
            type="text"
            value={ctx.audience}
            onChange={set("audience")}
            placeholder="e.g. B2B SaaS marketing managers, CTOs at mid-market companies"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition"
          />
        </div>

        {/* Writing Style */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Writing Style Inspiration
          </label>
          <select
            value={ctx.style}
            onChange={set("style")}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            {stylePresets.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Keywords to Include
            <span className="ml-1 text-gray-400 normal-case font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={ctx.keywords}
            onChange={set("keywords")}
            placeholder="e.g. demand generation, ABM, pipeline, intent data"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition"
          />
        </div>

        {/* Extra Context */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Additional Instructions
            <span className="ml-1 text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={ctx.extraContext}
            onChange={set("extraContext")}
            rows={3}
            placeholder="e.g. Include a case study example, focus on ROI metrics, avoid technical jargon, end with a strong CTA..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition resize-none"
          />
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading || disabled}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {disabled ? "Enter a title first" : "Generate with AI"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
