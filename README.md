# ATS Resume Optimizer

A production-ready Next.js 14+ application designed to analyze resumes against job descriptions, evaluate ATS match rates, identify critical keyword gaps, improve active phrasing without fabricating accomplishments, and generate clean, compilable **Overleaf LaTeX** source code (`resume.tex`).

---

## 🔒 Privacy & Zero-Data Retention Notice

> **"Your resume and job description are processed only to generate your tailored resume and are not stored."**

- **In-Memory File Processing:** Uploaded resumes (PDF, DOCX, TXT) and job descriptions are parsed in-memory on the server and freed immediately after the analysis response is completed.
- **Zero Database Persistence:** No personal data, resumes, or LaTeX files are stored in databases, logs, or external persistent storage.
- **Client & Server Isolation:** API keys remain strictly confined to the server-side environment (`.env.local`). No secrets are ever exposed to the client bundle.
- **No Git/Repository Sync:** Contains no Git push, GitHub integration, or remote repository creation mechanisms.

---

## 🚀 Key Features

1. **Multi-Format Resume Ingestion:**
   - PDF text extraction via `pdf-parse`.
   - DOCX parsing via `mammoth`.
   - UTF-8 Plain text and direct text input.
   - 5 MB file size safeguard and validation.

2. **ATS Match Scoring (0-100):**
   - **80–100:** Strong match (Emerald).
   - **60–79:** Moderate match (Amber).
   - **Below 60:** Needs improvement (Rose).
   - Real-time keyword coverage percentage and metric breakdowns.

3. **Truth-in-Resumes Keyword Categorization:**
   - **Present & Strong:** Positively matched with active context.
   - **Present but Weak:** Mentioned without sufficient business impact.
   - **Missing Skills:** Highlighted with the explicit safety warning: *"Add only if you have used this skill."*

4. **Section-by-Section Feedback:**
   - Pinpoints vague phrases (e.g., *"worked on"*, *"assisted with"*, *"responsible for"*).
   - Suggests quantifiable impact formulas (Google XYZ format).
   - Automatically provides `[add metric: ...]` placeholders where numbers are needed.

5. **Compilable Overleaf LaTeX Generation (`resume.tex`):**
   - Clean, ATS-compliant single-column layout.
   - Uses standard packages only (`article`, `geometry`, `enumitem`, `hyperref`, `titlesec`).
   - Escapes special LaTeX characters (`&`, `%`, `$`, `#`, `_`, `{`, `}`, `~`, `^`).
   - One-click **Copy Code** and **Download `resume.tex`**.
   - Step-by-step Overleaf compilation guide.

6. **Flexible LLM Provider Support & Built-in Engine:**
   - Supports **Google Gemini** (`gemini-1.5-flash`), **OpenAI** (`gpt-4o-mini`), and **Groq** (`llama-3.3-70b`).
   - Includes a deterministic, rule-based NLP matcher & LaTeX builder fallback so the application works out of the box even before configuring API keys.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Document Extractors:** `pdf-parse`, `mammoth`
- **LaTeX Engine:** Custom ATS generator with LaTeX sanitization

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+ installed
- npm or pnpm installed

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your preferred API key (e.g., Gemini or OpenAI):
```env
# Option 1: Google Gemini (Recommended - Free Tier Available)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Option 2: OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Option 3: Groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

*(Note: If no API key is provided, the application runs using its built-in heuristic analysis engine without throwing errors.)*

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
To test or build the production bundle:
```bash
npm run build
npm run start
```

---

## 📄 Overleaf Compilation Instructions

1. Log in to [Overleaf](https://www.overleaf.com) and click **New Project** &rarr; **Blank Project**.
2. Name your project (e.g., `Optimized_Resume`).
3. Replace the contents of `main.tex` with the copied code from the **LaTeX Code** tab (or upload `resume.tex`).
4. Ensure the compiler is set to **pdfLaTeX** (default in Overleaf).
5. Click **Recompile** and download your ATS-ready PDF resume.
