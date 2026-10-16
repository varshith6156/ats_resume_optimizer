/**
 * Server-side PDF text extractor using pdf-parse
 */
export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid bundling issues on edge/client
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    const cleanedText = data.text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();
    return cleanedText;
  } catch (error: any) {
    console.error("PDF Parsing error:", error);
    throw new Error(`Failed to parse PDF resume: ${error.message || "Unknown error"}`);
  }
}
