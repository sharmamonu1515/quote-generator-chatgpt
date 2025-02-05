/**
 * Cleans HTML content from a Markdown editor preview by removing newlines
 * while preserving HTML structure and meaningful whitespace
 *
 * @param {string} htmlContent - Raw HTML content from the editor
 * @returns {string} Cleaned HTML content with unnecessary newlines removed
 * @throws {Error} If input is not a string or is empty
 */
export const cleanEditorHtml = (htmlContent: string) => {
  // Input validation
  if (typeof htmlContent !== "string") {
    throw new Error("Input must be a string");
  }

  if (!htmlContent.trim()) {
    throw new Error("Input cannot be empty");
  }

  // Replace newlines and multiple spaces while preserving HTML structure
  return (
    htmlContent
      // Replace all newlines with spaces
      .replace(/\n/g, " ")
      // Replace multiple consecutive spaces with a single space
      .replace(/\s+/g, " ")
      // Preserve spacing around block elements
      .replace(/>\s+</g, "><")
      // Remove spaces after opening tags
      .replace(/>\s+/g, ">")
      // Remove spaces before closing tags
      .replace(/\s+</g, "<")
      // Final trim to remove any leading/trailing whitespace
      .trim()
  );
}
