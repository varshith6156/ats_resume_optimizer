import { AnalysisResult, AnalysisOptions } from "@/types";
import { SYSTEM_PROMPT, buildAnalysisUserPrompt } from "./prompts";
import { analyzeResumeFallback } from "./fallback-analyzer";
import { generateLatexResume } from "../latex/generator";

/**
 * Extracts and sanitizes JSON string from LLM responses (stripping markdown fences if present).
 */
function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Validates and normalizes the parsed JSON into a complete AnalysisResult
 */
function normalizeResult(parsed: any, originalResume: string): AnalysisResult {
  const result: AnalysisResult = {
    ats_score: typeof parsed.ats_score === "number" ? Math.min(100, Math.max(0, parsed.ats_score)) : 75,
    match_summary: parsed.match_summary || "Resume analyzed against job description requirements.",
    job_title: parsed.job_title || "Target Role",
    present_keywords: Array.isArray(parsed.present_keywords) ? parsed.present_keywords : [],
    weak_keywords: Array.isArray(parsed.weak_keywords) ? parsed.weak_keywords : [],
    missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords : [],
    keyword_suggestions: Array.isArray(parsed.keyword_suggestions) ? parsed.keyword_suggestions : [],
    section_feedback: Array.isArray(parsed.section_feedback) ? parsed.section_feedback : [],
    rewritten_resume: parsed.rewritten_resume || {
      summary: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
      certifications: [],
    },
    latex_code: parsed.latex_code || "",
  };

  // Ensure LaTeX code is populated and compilable
  if (!result.latex_code || result.latex_code.length < 50) {
    result.latex_code = generateLatexResume(
      result.rewritten_resume,
      result.rewritten_resume.name || "Candidate Name",
      result.rewritten_resume.contact || "email@example.com | (555) 000-0000"
    );
  }

  return result;
}

/**
 * Call Google Gemini API
 */
async function callGemini(
  apiKey: string,
  modelName: string,
  userPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty response.");
  return text;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  apiKey: string,
  modelName: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned empty response.");
  return text;
}

/**
 * Call Groq API
 */
async function callGroq(
  apiKey: string,
  modelName: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned empty response.");
  return text;
}

/**
 * Main analysis function that orchestrates LLM calls and fallbacks
 */
export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription: string,
  options?: AnalysisOptions
): Promise<AnalysisResult> {
  const userPrompt = buildAnalysisUserPrompt(resumeText, jobDescription, options);

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();

  // Try configured LLM APIs
  if (geminiKey) {
    try {
      const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const rawJson = await callGemini(geminiKey, model, userPrompt);
      const parsed = JSON.parse(cleanJsonString(rawJson));
      return normalizeResult(parsed, resumeText);
    } catch (err) {
      console.warn("Gemini API call failed, trying backup or fallback:", err);
    }
  }

  if (openaiKey) {
    try {
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const rawJson = await callOpenAI(openaiKey, model, userPrompt);
      const parsed = JSON.parse(cleanJsonString(rawJson));
      return normalizeResult(parsed, resumeText);
    } catch (err) {
      console.warn("OpenAI API call failed, trying backup or fallback:", err);
    }
  }

  if (groqKey) {
    try {
      const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
      const rawJson = await callGroq(groqKey, model, userPrompt);
      const parsed = JSON.parse(cleanJsonString(rawJson));
      return normalizeResult(parsed, resumeText);
    } catch (err) {
      console.warn("Groq API call failed, falling back:", err);
    }
  }

  // Graceful deterministic fallback engine
  return analyzeResumeFallback(resumeText, jobDescription, options);
}
