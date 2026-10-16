export interface KeywordSuggestion {
  keyword: string;
  status: "present" | "weak" | "missing";
  recommendation: string;
  safe_to_add: boolean;
}

export interface SectionFeedback {
  section: string;
  issues: string[];
  suggestions: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  technologies: string[];
  bullets: string[];
}

export interface RewrittenResume {
  name?: string;
  contact?: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: string[];
  certifications: string[];
}

export interface AnalysisResult {
  ats_score: number;
  match_summary: string;
  job_title: string;
  present_keywords: string[];
  weak_keywords: string[];
  missing_keywords: string[];
  keyword_suggestions: KeywordSuggestion[];
  section_feedback: SectionFeedback[];
  rewritten_resume: RewrittenResume;
  latex_code: string;
}

export interface AnalysisOptions {
  targetRole?: string;
  experienceLevel?: string;
  preferredLength?: "1 page" | "2 pages" | "flexible";
}
