"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Filter } from "lucide-react";
import { AnalysisResult } from "@/types";

interface KeywordAnalysisTabProps {
  result: AnalysisResult;
}

export function KeywordAnalysisTab({ result }: KeywordAnalysisTabProps) {
  const [filter, setFilter] = useState<"all" | "missing" | "weak" | "present">("all");

  const filteredSuggestions = result.keyword_suggestions.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter Keywords:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({result.keyword_suggestions.length})
          </button>
          <button
            onClick={() => setFilter("missing")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filter === "missing"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            Missing ({result.missing_keywords.length})
          </button>
          <button
            onClick={() => setFilter("weak")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filter === "weak"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Weak / Needs Context ({result.weak_keywords.length})
          </button>
          <button
            onClick={() => setFilter("present")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filter === "present"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Present & Strong ({result.present_keywords.length})
          </button>
        </div>
      </div>

      {/* Safety Notice regarding Missing Keywords */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <p className="font-semibold">Truth-in-Resumes Safeguard:</p>
          <p className="mt-0.5 text-amber-800">
            Never insert missing skills unless you possess verifiable experience with them. If you lack experience with a missing skill, leave it off or mention related foundational technologies honestly.
          </p>
        </div>
      </div>

      {/* Keyword Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filteredSuggestions.map((item, idx) => {
          let statusBadge;
          let borderCol;

          if (item.status === "present") {
            borderCol = "border-emerald-200 bg-emerald-50/30";
            statusBadge = (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                Present & Strong
              </span>
            );
          } else if (item.status === "weak") {
            borderCol = "border-amber-200 bg-amber-50/30";
            statusBadge = (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                <AlertTriangle className="h-3 w-3" />
                Present but Weak
              </span>
            );
          } else {
            borderCol = "border-rose-200 bg-rose-50/30";
            statusBadge = (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                <XCircle className="h-3 w-3" />
                Missing from Resume
              </span>
            );
          }

          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${borderCol}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm">{item.keyword}</h4>
                {statusBadge}
              </div>

              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                {item.recommendation}
              </p>

              {item.status === "missing" && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600 font-medium">
                  <span>Recommendation: Add only if you have used this skill</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
