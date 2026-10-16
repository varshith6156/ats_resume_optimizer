"use client";

import React, { useState } from "react";
import { Copy, Check, FileText, Sparkles, AlertCircle } from "lucide-react";
import { RewrittenResume } from "@/types";

interface RewrittenResumeTabProps {
  resume: RewrittenResume;
}

export function RewrittenResumeTab({ resume }: RewrittenResumeTabProps) {
  const [copied, setCopied] = useState(false);

  const getPlainTextResume = () => {
    let text = `${resume.name || "Candidate Name"}\n${resume.contact || ""}\n\n`;

    if (resume.summary) {
      text += `PROFESSIONAL SUMMARY\n${resume.summary}\n\n`;
    }

    if (resume.skills && resume.skills.length > 0) {
      text += `TECHNICAL SKILLS\n${resume.skills.map((s) => `- ${s}`).join("\n")}\n\n`;
    }

    if (resume.experience && resume.experience.length > 0) {
      text += `EXPERIENCE\n`;
      resume.experience.forEach((exp) => {
        text += `${exp.role} | ${exp.company} | ${exp.duration}\n`;
        (exp.bullets || []).forEach((b) => {
          text += `- ${b}\n`;
        });
        text += `\n`;
      });
    }

    if (resume.projects && resume.projects.length > 0) {
      text += `PROJECTS\n`;
      resume.projects.forEach((proj) => {
        text += `${proj.name} ${proj.technologies?.length ? `(${proj.technologies.join(", ")})` : ""}\n`;
        (proj.bullets || []).forEach((b) => {
          text += `- ${b}\n`;
        });
        text += `\n`;
      });
    }

    if (resume.education && resume.education.length > 0) {
      text += `EDUCATION\n${resume.education.map((e) => `- ${e}`).join("\n")}\n\n`;
    }

    if (resume.certifications && resume.certifications.length > 0) {
      text += `CERTIFICATIONS\n${resume.certifications.map((c) => `- ${c}`).join("\n")}\n\n`;
    }

    return text.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlainTextResume());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
        <div>
          <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            ATS-Optimized Content Preview
          </h4>
          <p className="text-xs text-indigo-800 mt-0.5">
            Preserves your factual background while improving verb strength, ATS keyword positioning, and metric prompts.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Plain Text</span>
            </>
          )}
        </button>
      </div>

      {/* Guide Banner for Metrics */}
      <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <span>
          <strong>Metric Placeholders:</strong> Items marked with{" "}
          <span className="font-mono bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold">
            [add metric: ...]
          </span>{" "}
          indicate spots where real numbers will significantly improve your ATS ranking. Replace them with your actual figures.
        </span>
      </div>

      {/* Clean Document View */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm font-sans space-y-6 text-slate-800">
        {/* Contact info */}
        <div className="text-center border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            {resume.name || "Candidate Name"}
          </h2>
          <p className="mt-1 text-xs text-slate-600 font-medium">
            {resume.contact || "email@example.com | (555) 000-0000 | Location"}
          </p>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Professional Summary
            </h3>
            <p className="text-xs leading-relaxed text-slate-700">
              {resume.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Technical Skills
            </h3>
            <ul className="space-y-1 text-xs text-slate-700 pl-4 list-disc">
              {resume.skills.map((skill, sIdx) => (
                <li key={sIdx}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Work Experience
            </h3>
            <div className="space-y-4">
              {resume.experience.map((exp, eIdx) => (
                <div key={eIdx}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {exp.role} &bull; {exp.company}
                    </span>
                    <span className="text-slate-500 italic">
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                    {(exp.bullets || []).map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet.includes("[add metric") ? (
                          <span>
                            {bullet.split(/(\[add metric[^\]]*\])/).map((part, pIdx) =>
                              part.startsWith("[add metric") ? (
                                <span
                                  key={pIdx}
                                  className="font-mono bg-amber-100 text-amber-800 font-semibold px-1 rounded"
                                >
                                  {part}
                                </span>
                              ) : (
                                part
                              )
                            )}
                          </span>
                        ) : (
                          bullet
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Technical Projects
            </h3>
            <div className="space-y-3">
              {resume.projects.map((proj, pIdx) => (
                <div key={pIdx}>
                  <div className="text-xs font-bold text-slate-900">
                    {proj.name}{" "}
                    {proj.technologies?.length ? (
                      <span className="font-normal italic text-slate-500">
                        ({proj.technologies.join(", ")})
                      </span>
                    ) : null}
                  </div>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-700 pl-4 list-disc">
                    {(proj.bullets || []).map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Education
            </h3>
            <ul className="space-y-1 text-xs text-slate-700 pl-4 list-disc">
              {resume.education.map((edu, idx) => (
                <li key={idx}>{edu}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Certifications
            </h3>
            <ul className="space-y-1 text-xs text-slate-700 pl-4 list-disc">
              {resume.certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
