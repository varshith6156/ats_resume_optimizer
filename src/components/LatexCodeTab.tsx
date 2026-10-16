"use client";

import React, { useState } from "react";
import { Copy, Download, Check, ExternalLink, Code2, Terminal, Info } from "lucide-react";

interface LatexCodeTabProps {
  latexCode: string;
}

export function LatexCodeTab({ latexCode }: LatexCodeTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: "text/x-tex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume.tex");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-blue-600" />
            Overleaf-Ready Single Column LaTeX Code
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            100% Compilable &bull; Standard Packages Only &bull; Escaped Special Characters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download resume.tex</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Overleaf Compilation Guide */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-blue-600" />
          How to Compile in Overleaf (30 Seconds):
        </h4>
        <ol className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-4 text-xs text-blue-950 font-medium">
          <li className="rounded-lg bg-white/80 p-3 border border-blue-200/50 shadow-xs">
            <span className="font-bold text-blue-600">1.</span> Open{" "}
            <a
              href="https://www.overleaf.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline font-bold inline-flex items-center gap-0.5"
            >
              Overleaf <ExternalLink className="h-2.5 w-2.5" />
            </a>{" "}
            and create a <strong>Blank Project</strong>.
          </li>
          <li className="rounded-lg bg-white/80 p-3 border border-blue-200/50 shadow-xs">
            <span className="font-bold text-blue-600">2.</span> Replace all code in{" "}
            <code className="bg-blue-100/70 px-1 py-0.5 rounded font-mono text-[11px]">
              main.tex
            </code>{" "}
            with the code below.
          </li>
          <li className="rounded-lg bg-white/80 p-3 border border-blue-200/50 shadow-xs">
            <span className="font-bold text-blue-600">3.</span> Ensure the compiler is set to{" "}
            <strong>pdfLaTeX</strong> and click <strong>Recompile</strong>.
          </li>
          <li className="rounded-lg bg-white/80 p-3 border border-blue-200/50 shadow-xs">
            <span className="font-bold text-blue-600">4.</span> Click{" "}
            <strong>Download PDF</strong> for your ATS-compliant resume!
          </li>
        </ol>
      </div>

      {/* Code Display */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-xs text-slate-300 font-semibold pl-2">
              resume.tex
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            {latexCode.split("\n").length} lines &bull; LaTeX
          </span>
        </div>

        <div className="max-h-[550px] overflow-auto p-4 font-mono text-xs text-slate-200 selection:bg-blue-900 selection:text-white leading-relaxed">
          <pre>
            <code>{latexCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
