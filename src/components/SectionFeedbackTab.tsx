"use client";

import React from "react";
import { AlertCircle, CheckCircle, Sparkles, HelpCircle } from "lucide-react";
import { SectionFeedback } from "@/types";

interface SectionFeedbackTabProps {
  feedback: SectionFeedback[];
}

export function SectionFeedbackTab({ feedback }: SectionFeedbackTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900">
        <p className="font-semibold flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-blue-600" />
          ATS Formatting & Phrasing Standards:
        </p>
        <p className="mt-1 text-blue-800">
          Ensure section headings strictly follow machine-readable conventions (Summary, Skills, Experience, Education, Projects). Replace ambiguous passive verbs with quantified impact formulas.
        </p>
      </div>

      <div className="space-y-4">
        {feedback.map((sec, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {sec.section}
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {sec.issues.length} {sec.issues.length === 1 ? "issue" : "issues"} flagged
              </span>
            </div>

            {/* Identified Issues */}
            {sec.issues && sec.issues.length > 0 && (
              <div className="mt-3.5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Identified Weaknesses & Vague Phrasing:
                </p>
                <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-700">
                  {sec.issues.map((issue, iIdx) => (
                    <li key={iIdx} className="leading-relaxed">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvement Suggestions */}
            {sec.suggestions && sec.suggestions.length > 0 && (
              <div className="mt-3.5 space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Recommended Improvements:
                </p>
                <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-700">
                  {sec.suggestions.map((sug, sIdx) => (
                    <li key={sIdx} className="leading-relaxed">
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
