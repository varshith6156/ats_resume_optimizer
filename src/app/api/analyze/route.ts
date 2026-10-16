import { NextRequest, NextResponse } from "next/server";
import { extractResumeText } from "@/lib/parsers";
import { analyzeResumeWithAI } from "@/lib/ai/analyzer";
import { AnalysisOptions } from "@/types";

export const maxDuration = 60; // Next.js serverless execution timeout

// 5 MB limit
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let resumeText = "";
    let jobDescription = "";
    let options: AnalysisOptions = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const resumeFile = formData.get("resumeFile") as File | null;
      const rawText = formData.get("resumeText") as string | null;
      jobDescription = (formData.get("jobDescription") as string) || "";
      
      const targetRole = formData.get("targetRole") as string | null;
      const experienceLevel = formData.get("experienceLevel") as string | null;
      const preferredLength = formData.get("preferredLength") as any;

      options = {
        targetRole: targetRole || undefined,
        experienceLevel: experienceLevel || undefined,
        preferredLength: preferredLength || undefined,
      };

      if (resumeFile && resumeFile.size > 0) {
        // Enforce 5MB limit
        if (resumeFile.size > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: "File size exceeds the 5 MB limit. Please upload a smaller document." },
            { status: 400 }
          );
        }

        try {
          resumeText = await extractResumeText(resumeFile);
        } catch (parseErr: any) {
          return NextResponse.json(
            { error: parseErr.message || "Failed to extract text from the uploaded document." },
            { status: 422 }
          );
        }
      } else if (rawText && rawText.trim()) {
        resumeText = rawText.trim();
      }
    } else {
      // JSON body
      const body = await req.json();
      resumeText = body.resumeText || "";
      jobDescription = body.jobDescription || "";
      options = {
        targetRole: body.targetRole,
        experienceLevel: body.experienceLevel,
        preferredLength: body.preferredLength,
      };
    }

    // Input Validation
    if (!resumeText || resumeText.trim().length < 40) {
      return NextResponse.json(
        {
          error:
            "Resume content is too short or empty. Please upload a valid resume (PDF, DOCX, TXT) or paste your resume text.",
        },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Job description is missing or too short. Please provide the full job description for ATS comparison.",
        },
        { status: 400 }
      );
    }

    // Process analysis strictly in-memory (No database persistence)
    const analysisResult = await analyzeResumeWithAI(
      resumeText.trim(),
      jobDescription.trim(),
      options
    );

    // Return the response immediately
    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
  } catch (error: any) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "An unexpected server error occurred while analyzing the resume. Please try again.",
      },
      { status: 500 }
    );
  }
}
