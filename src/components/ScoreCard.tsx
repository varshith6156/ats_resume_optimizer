"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Award, Target, Hash } from "lucide-react";
import { AnalysisResult } from "@/types";

interface ScoreCardProps {
  result: AnalysisResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  const { ats_score, match_summary, job_title, present_keywords, weak_keywords, missing_keywords } = result;

  // Determine score color and rating
  let tierColor = "text-rose-600 bg-rose-50 border-rose-200 ring-rose-500/20";
  let badgeText = "Needs Improvement";
  let badgeBg = "bg-rose-100 text-rose-800";
  let progressBg = "bg-rose-500";
  let icon = <AlertCircle className="h-6 w-6 text-rose-600" />;

  if (ats_score >= 80) {
    tierColor = "text-emerald-600 bg-emerald-50 border-emerald-200 ring-emerald-500/20";
    badgeText = "Strong Match";
    badgeBg = "bg-emerald-100 text-emerald-800";
    progressBg = "bg-emerald-500";
    icon = <CheckCircle2 className="h-6 w-6 text-emerald-600" />;
  } else if (ats_score >= 60) {
    tierColor = "text-amber-600 bg-amber-50 border-amber-200 ring-amber-500/20";
    badgeText = "Moderate Match";
    badgeBg = "bg-amber-100 text-amber-800";
    progressBg = "bg-amber-500";
    icon = <AlertTriangle className="h-6 w-6 text-amber-600" />;
  }

  const totalKeywords = present_keywords.length + weak_keywords.length + missing_keywords.length;
  const coveragePercent = totalKeywords > 0
    ? Math.round(((present_keywords.length + weak_keywords.length * 0.5) / totalKeywords) * 100)
    : ats_score;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Score Dial & Gauge */}
        <div className="flex flex-col items-center justify-center text-center lg:col-span-4 lg:border-r lg:border-slate-100 lg:pr-6">
          <div className="relative flex h-36 w-36 items-center justify-center">
            {/* Background Circle */}
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * ats_score) / 100}
                strokeLinecap="round"
                fill="transparent"
                className={`${ats_score >= 80 ? "text-emerald-500" : ats_score >= 60 ? "text-amber-500" : "text-rose-500"} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                {ats_score}
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badgeBg}`}
            >
              {icon}
              <span>{badgeText}</span>
            </span>
          </div>
        </div>

        {/* Breakdown & Summary */}
        <div className="space-y-4 lg:col-span-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Target className="h-3.5 w-3.5 text-blue-600" />
              <span>Target Role: {job_title}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {match_summary}
            </p>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-xs font-medium text-slate-500">Keyword Coverage</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{coveragePercent}%</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
              <p className="text-xs font-medium text-emerald-700">Strong Matches</p>
              <p className="mt-1 text-xl font-bold text-emerald-900">{present_keywords.length}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
              <p className="text-xs font-medium text-amber-700">Weak/Buried</p>
              <p className="mt-1 text-xl font-bold text-amber-900">{weak_keywords.length}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
              <p className="text-xs font-medium text-rose-700">Missing Terms</p>
              <p className="mt-1 text-xl font-bold text-rose-900">{missing_keywords.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
