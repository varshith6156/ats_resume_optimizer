import { RewrittenResume } from "@/types";

/**
 * Escapes LaTeX special characters to ensure compilation without errors.
 */
export function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

/**
 * Builds a clean, single-column, ATS-safe LaTeX resume document
 * that compiles cleanly in Overleaf with pdfLaTeX.
 */
export function generateLatexResume(
  data: RewrittenResume,
  candidateName = "Candidate Name",
  contactInfo = "email@example.com | (555) 000-0000 | LinkedIn: /in/profile"
): string {
  const safeName = escapeLatex(data.name || candidateName);
  const safeContact = escapeLatex(data.contact || contactInfo);

  let doc = `% ATS Resume Optimizer - Overleaf Compilable Template
% Compiler: pdfLaTeX | Layout: Single-column ATS Friendly
\\documentclass[10pt,letterpaper]{article}

\\usepackage[margin=0.7in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}

% Set page margins & formatting
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

% Section title formatting
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{5pt}

% List spacing for high ATS readability
\\setlist[itemize]{leftmargin=1.5em, itemsep=2pt, topsep=2pt, parsep=0pt}

% Hyperlink configuration
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue,
    pdfnewwindow=true
}

\\begin{document}

% ── HEADER / CONTACT DETAILS ──
\\begin{center}
    {\\huge \\textbf{${safeName}}} \\\\[4pt]
    {\\small ${safeContact}}
\\end{center}
\\vspace{-4pt}
`;

  // Summary
  if (data.summary && data.summary.trim()) {
    doc += `
% ── PROFESSIONAL SUMMARY ──
\\section{Professional Summary}
${escapeLatex(data.summary)}
\\vspace{4pt}
`;
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    const formattedSkills = data.skills
      .map((skillGroup) => `\\item ${escapeLatex(skillGroup)}`)
      .join("\n");
    doc += `
% ── TECHNICAL SKILLS ──
\\section{Technical Skills}
\\begin{itemize}
${formattedSkills}
\\end{itemize}
\\vspace{4pt}
`;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    doc += `
% ── PROFESSIONAL EXPERIENCE ──
\\section{Experience}
`;
    data.experience.forEach((exp) => {
      const company = escapeLatex(exp.company || "Company");
      const role = escapeLatex(exp.role || "Job Title");
      const duration = escapeLatex(exp.duration || "Dates");

      doc += `\\textbf{${role}} \\hfill \\textbf{${company}} \\\\
\\textit{${duration}}
\\begin{itemize}
`;
      (exp.bullets || []).forEach((bullet) => {
        doc += `  \\item ${escapeLatex(bullet)}\n`;
      });
      doc += `\\end{itemize}
\\vspace{4pt}
`;
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    doc += `
% ── PROJECTS ──
\\section{Projects}
`;
    data.projects.forEach((proj) => {
      const name = escapeLatex(proj.name || "Project Name");
      const tech = proj.technologies?.length
        ? ` \\textit{(${escapeLatex(proj.technologies.join(", "))})}`
        : "";
      doc += `\\textbf{${name}}${tech}
\\begin{itemize}
`;
      (proj.bullets || []).forEach((bullet) => {
        doc += `  \\item ${escapeLatex(bullet)}\n`;
      });
      doc += `\\end{itemize}
\\vspace{4pt}
`;
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    doc += `
% ── EDUCATION ──
\\section{Education}
\\begin{itemize}
`;
    data.education.forEach((edu) => {
      doc += `  \\item ${escapeLatex(edu)}\n`;
    });
    doc += `\\end{itemize}
\\vspace{4pt}
`;
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    doc += `
% ── CERTIFICATIONS ──
\\section{Certifications}
\\begin{itemize}
`;
    data.certifications.forEach((cert) => {
      doc += `  \\item ${escapeLatex(cert)}\n`;
    });
    doc += `\\end{itemize}
`;
  }

  doc += `
\\end{document}
`;

  return doc;
}
