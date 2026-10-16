import mammoth from "mammoth";

/**
 * Server-side DOCX text extractor using mammoth
 */
export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();
    return text;
  } catch (error: any) {
    console.error("DOCX Parsing error:", error);
    throw new Error(`Failed to parse DOCX resume: ${error.message || "Unknown error"}`);
  }
}
