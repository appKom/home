/**
 * Extracts plain text from HTML/Markdown content
 * @param content HTML or Markdown content
 * @returns Plain text with all HTML/Markdown formatting removed
 */
export function stripHtmlAndMarkdown(content: string): string {
  if (!content) return "";

  // Remove HTML tags
  const withoutHtml = content.replace(/<[^>]*>/g, "");

  // Remove Markdown formatting
  return (
    withoutHtml
      // Remove headers (#)
      .replace(/#{1,6}\s?/g, "")
      // Remove bold/italic
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
      // Remove links
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      // Remove images
      .replace(/!\[([^\]]+)\]$$[^)]+$$/g, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove blockquotes
      .replace(/^\s*>\s?/gm, "")
      // Remove horizontal rules
      .replace(/^\s*[-*_]{3,}\s*$/gm, "")
      // Clean up extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}
