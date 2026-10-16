"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { FileUpload } from "@/components/FileUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { ScoreCard } from "@/components/ScoreCard";
import { KeywordAnalysisTab } from "@/components/KeywordAnalysisTab";
import { SectionFeedbackTab } from "@/components/SectionFeedbackTab";
import { RewrittenResumeTab } from "@/components/RewrittenResumeTab";
import { LatexCodeTab } from "@/components/LatexCodeTab";
import { AnalysisResult, AnalysisOptions } from "@/types";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  KeyRound,
  FileCode,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [rawResumeText, setRawResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [options, setOptions] = useState<AnalysisOptions>({});

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [activeTab, setActiveTab] = useState<
    "keywords" | "missing" | "feedback" | "resume" | "latex"
  >("keywords");

  const handleAnalyze = async () => {
    setError(null);

    // Validation
    if (!file && (!rawResumeText || rawResumeText.trim().length < 40)) {
      setError(
        "Please upload a resume file (PDF, DOCX, TXT) or paste your resume content before analyzing."
      );
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setError(
        "Please provide a target job description so the ATS matcher can evaluate keyword coverage."
      );
      return;
    }

    setLoading(true);
    setLoadingStep("Extracting and parsing resume content...");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("resumeFile", file);
      } else {
        formData.append("resumeText", rawResumeText);
      }

      formData.append("jobDescription", jobDescription);
      if (options.targetRole) formData.append("targetRole", options.targetRole);
      if (options.experienceLevel)
        formData.append("experienceLevel", options.experienceLevel);
      if (options.preferredLength)
        formData.append("preferredLength", options.preferredLength);

      // Transition loading messages
      const timer1 = setTimeout(() => {
        setLoadingStep("Matching keywords and identifying ATS coverage gaps...");
      }, 1500);

      const timer2 = setTimeout(() => {
        setLoadingStep(
          "Rewriting bullets with action verbs & compiling Overleaf LaTeX..."
        );
      }, 3500);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setResult(data.data);
      setActiveTab("keywords");

      // Smooth scroll to results
      setTimeout(() => {
        document
          .getElementById("results-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(
        err.message ||
          "An unexpected error occurred. Please verify your inputs and try again."
      );
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Strict Truth-Preserving ATS Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 sm:leading-tight">
            Tailor Your Resume for ATS &amp; Export Clean{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Overleaf LaTeX
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Upload your resume, paste the target job description, and get instant
            ATS match scoring, missing keyword detection, active-verb enhancements,
            and compilable LaTeX code with zero data retention.
          </p>
        </div>

        {/* Visible Privacy Notice */}
        <div className="max-w-4xl mx-auto">
          <PrivacyNotice />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="max-w-4xl mx-auto flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 shadow-sm animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Analysis Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-2"
            >
              &times;
            </button>
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
          <FileUpload
            file={file}
            onFileSelect={setFile}
            rawText={rawResumeText}
            onRawTextChange={setRawResumeText}
          />

          <JobDescriptionInput
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            options={options}
            onOptionsChange={setOptions}
          />
        </div>

        {/* Primary CTA Button */}
        <div className="flex flex-col items-center justify-center pt-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 hover:shadow-indigo-500/25 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Analyzing Resume...</span>
              </>
            ) : (
              <>
                <span>Analyze Resume</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {loading && (
            <div className="mt-3 text-center space-y-1">
              <p className="text-xs font-medium text-slate-700 animate-pulse">
                {loadingStep}
              </p>
              <p className="text-[11px] text-slate-400">
                In-memory processing active &bull; Never stored
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div id="results-section" className="pt-8 space-y-6 max-w-6xl mx-auto">
            {/* Header & Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 pt-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  ATS Optimization Results
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Targeted analysis for <strong>{result.job_title}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Analyze Another</span>
              </button>
            </div>

            {/* Score Card */}
            <ScoreCard result={result} />

            {/* Tabs Navigation */}
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex flex-wrap gap-1 sm:gap-2 border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("keywords")}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    activeTab === "keywords"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Keyword Coverage</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      activeTab === "keywords"
                        ? "bg-blue-700 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {result.keyword_suggestions.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("missing")}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    activeTab === "missing"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Missing Skills</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      activeTab === "missing"
                        ? "bg-blue-700 text-white"
                        : "bg-rose-100 text-rose-700 font-bold"
                    }`}
                  >
                    {result.missing_keywords.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("feedback")}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    activeTab === "feedback"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Resume Feedback</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      activeTab === "feedback"
                        ? "bg-blue-700 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {result.section_feedback.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("resume")}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    activeTab === "resume"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Tailored Resume</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("latex")}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    activeTab === "latex"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>LaTeX Code</span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                    Overleaf
                  </span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-4">
                {activeTab === "keywords" && (
                  <KeywordAnalysisTab result={result} />
                )}

                {activeTab === "missing" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-xs text-rose-900">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                        Skills required by the Job Description but absent on your resume:
                      </p>
                      <p className="mt-1 text-rose-800">
                        Review this list carefully. If you have practical exposure to any of these tools or frameworks, add them to your skills list or mention them inside your experience bullets. If you do not have experience, do not fabricate.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {result.missing_keywords.map((kw, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-rose-200 bg-white p-4 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">
                              {kw}
                            </span>
                            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                              Missing
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            Add only if you have demonstrated experience using this technology.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "feedback" && (
                  <SectionFeedbackTab feedback={result.section_feedback} />
                )}

                {activeTab === "resume" && (
                  <RewrittenResumeTab resume={result.rewritten_resume} />
                )}

                {activeTab === "latex" && (
                  <LatexCodeTab latexCode={result.latex_code} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} ATS Resume Optimizer &bull; Built with Next.js 14 &amp; TypeScript.
          </p>
          <p className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Private &bull; In-Memory Processing &bull; No Persistent Database</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
