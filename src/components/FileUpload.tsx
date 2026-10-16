"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from "lucide-react";

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  rawText: string;
  onRawTextChange: (text: string) => void;
}

export function FileUpload({
  file,
  onFileSelect,
  rawText,
  onRawTextChange,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMsg(null);
    const validExtensions = [".pdf", ".docx", ".txt", ".md"];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(ext) && !selectedFile.type.includes("pdf") && !selectedFile.type.includes("word") && !selectedFile.type.startsWith("text/")) {
      setErrorMsg("Unsupported file format. Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt) file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5 MB. Please upload a smaller document.");
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrorMsg(null);
  };

  const loadSampleResume = () => {
    setMode("paste");
    onFileSelect(null);
    onRawTextChange(`Alex Morgan
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Full-Stack Software Engineer with 4+ years of experience designing and shipping web applications and distributed backend systems. Proficient in TypeScript, React, Next.js, and Node.js with a solid grasp of database architecture and automated testing.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, HTML5, CSS3, SQL
- Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, Jest
- Databases & Storage: PostgreSQL, Redis, MongoDB
- Tools & Cloud: Git, GitHub, Docker, AWS (S3, EC2), REST APIs

PROFESSIONAL EXPERIENCE
Software Engineer | Apex Cloud Solutions | 2022 - Present
- Worked on customer-facing dashboard using React and TypeScript for over 100,000 monthly active users.
- Responsible for backend REST APIs in Node.js and PostgreSQL database optimization.
- Assisted with migration of monolithic services into containerized microservices using Docker.
- Handled various bug fixes and improved overall page load speeds.

Junior Web Developer | Horizon Labs | 2020 - 2022
- Developed responsive web interfaces using JavaScript, React, and CSS.
- Built reusable UI components and collaborated with UX designers to enhance user flow.
- Created unit tests with Jest to improve code reliability.

EDUCATION
Bachelor of Science in Computer Science
University of California, Davis (2016 - 2020)

PROJECTS
TaskFlow - Real-time Project Management Tool
- Built full-stack Kanban application using Next.js, PostgreSQL, and WebSockets.
- Implemented user authentication with JWT and automated unit testing.`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            1. Your Current Resume
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload in PDF, DOCX, or TXT format (Preserves original order & styling)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSampleResume}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
          >
            Load Sample
          </button>
          <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                mode === "upload"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              File
            </button>
            <button
              type="button"
              onClick={() => setMode("paste")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                mode === "paste"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>
      </div>

      {mode === "upload" ? (
        <div>
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50/60"
                  : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="resume-file-input"
              />
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-800">
                Click to browse or drag and drop your resume
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Supports PDF, DOCX, or TXT (Max 5 MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB &bull; Ready for in-memory analysis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearFile}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={rawText}
            onChange={(e) => onRawTextChange(e.target.value)}
            placeholder="Paste your plain text resume here (including contact info, experience bullets, and skills)..."
            rows={9}
            className="w-full rounded-xl border border-slate-300 p-3.5 text-sm font-mono text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{rawText.length} characters</span>
            <span>{rawText ? rawText.trim().split(/\s+/).length : 0} words</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
