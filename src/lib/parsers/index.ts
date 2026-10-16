import { parsePdfBuffer } from "./pdf-parser";
import { parseDocxBuffer } from "./docx-parser";

export async function extractResumeText(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
    return await parsePdfBuffer(buffer);
  } else if (
    fileName.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await parseDocxBuffer(buffer);
  } else if (
    fileName.endsWith(".txt") ||
    file.type.startsWith("text/") ||
    fileName.endsWith(".md")
  ) {
    return buffer.toString("utf-8").trim();
  } else {
    throw new Error(
      "Unsupported file format. Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt) file."
    );
  }
}
