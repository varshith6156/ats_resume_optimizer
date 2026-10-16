"use client";

import React, { useState } from "react";
import { Briefcase, SlidersHorizontal, Sparkles } from "lucide-react";
import { AnalysisOptions } from "@/types";

interface JobDescriptionInputProps {
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
  options: AnalysisOptions;
  onOptionsChange: (options: AnalysisOptions) => void;
}

export function JobDescriptionInput({
  jobDescription,
  onJobDescriptionChange,
  options,
  onOptionsChange,
}: JobDescriptionInputProps) {
  const [showOptions, setShowOptions] = useState(false);

  const loadSampleJob = () => {
    onJobDescriptionChange(`Senior Full-Stack Software Engineer
Company: CloudScale Dynamics | Location: Remote / San Francisco, CA

About the Role:
We are seeking a Senior Full-Stack Software Engineer to architect, build, and scale our enterprise data visualization platform. You will spearhead core features across our frontend and backend microservices, mentor junior engineers, and drive technical excellence.

Key Responsibilities:
- Architect and maintain performant, scalable web applications using TypeScript, React, Next.js, and Node.js.
- Design, implement, and optimize REST APIs and GraphQL services backed by PostgreSQL and Redis.
- Collaborate with product managers and UX designers to transform product specs into high-converting user interfaces using Tailwind CSS.
- Build resilient CI/CD pipelines with GitHub Actions and containerize services using Docker and Kubernetes on AWS.
- Conduct thorough code reviews, champion automated unit testing with Jest, and maintain 90%+ code coverage.
- Monitor application latency, debug distributed systems, and implement performance optimizations.

Requirements & Qualifications:
- 4+ years of professional full-stack development experience.
- Strong proficiency in modern JavaScript / TypeScript, React, Next.js, and Node.js.
- Hands-on experience with relational databases (PostgreSQL preferred) and query optimization.
- Proven experience deploying and managing cloud infrastructure on AWS (Amazon Web Services), including Docker and CI/CD pipelines.
- Solid understanding of microservices architecture, RESTful API design, and asynchronous event-driven systems.
- Excellent communication skills and passion for engineering craftsmanship.`);

    onOptionsChange({
      ...options,
      targetRole: "Senior Full-Stack Software Engineer",
      experienceLevel: "Senior (4-6+ years)",
      preferredLength: "1 page",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            2. Target Job Description
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paste the full requirements, responsibilities, and qualifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSampleJob}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md transition-colors"
          >
            Load Sample JD
          </button>
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              showOptions
                ? "bg-indigo-50 text-indigo-700"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Options</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here (e.g. Senior Software Engineer at TechCorp)..."
          rows={9}
          className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>{jobDescription.length} characters</span>
          <span>{jobDescription ? jobDescription.trim().split(/\s+/).length : 0} words</span>
        </div>
      </div>

      {showOptions && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3 transition-all">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Optional Tuning Parameters
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Target Role
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={options.targetRole || ""}
                onChange={(e) =>
                  onOptionsChange({ ...options, targetRole: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Experience Level
              </label>
              <select
                value={options.experienceLevel || ""}
                onChange={(e) =>
                  onOptionsChange({ ...options, experienceLevel: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Auto-Detect from JD</option>
                <option value="Entry-Level (0-2 years)">Entry-Level (0-2 years)</option>
                <option value="Mid-Level (2-5 years)">Mid-Level (2-5 years)</option>
                <option value="Senior (5-8+ years)">Senior (5-8+ years)</option>
                <option value="Lead / Staff (8+ years)">Lead / Staff (8+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Preferred Length
              </label>
              <select
                value={options.preferredLength || "flexible"}
                onChange={(e) =>
                  onOptionsChange({
                    ...options,
                    preferredLength: e.target.value as any,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="1 page">Strict 1 Page (Standard)</option>
                <option value="2 pages">2 Pages (Senior / Academic)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
