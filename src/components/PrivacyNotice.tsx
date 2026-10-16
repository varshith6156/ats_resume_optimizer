"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, ChevronDown, ChevronUp } from "lucide-react";

export function PrivacyNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950 shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Your resume and job description are processed only to generate your tailored resume and are not stored.
            </p>
            <p className="mt-0.5 text-xs text-emerald-800">
              Files are evaluated in-memory and discarded immediately upon response completion. No databases, logs, or external persistent storage are used.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-emerald-700 hover:text-emerald-900 transition-colors p-1"
          title="Toggle privacy guarantee details"
          aria-label="Toggle privacy details"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs text-emerald-900 space-y-1.5">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            <span><strong>In-Memory File Processing:</strong> Uploaded buffers (PDF/DOCX/TXT) are parsed in ephemeral server memory and released instantly.</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            <span><strong>Zero External Database:</strong> Neither your original resume, target job description, nor generated LaTeX code is written to disk or any cloud database.</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            <span><strong>Private & Secret Keys:</strong> All LLM requests execute strictly through secure server-side routes; API keys are never exposed in browser code.</span>
          </div>
        </div>
      )}
    </div>
  );
}
