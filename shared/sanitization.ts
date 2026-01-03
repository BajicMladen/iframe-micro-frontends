/**
 * Sanitization utilities for user-generated content
 * Note: For production use, install and import DOMPurify library
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * This is a basic implementation. For production, use DOMPurify library.
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Basic sanitization - remove script tags and dangerous attributes
  let sanitized = html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '');

  return sanitized;
}

/**
 * Strip all HTML tags and return plain text
 *
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHTML(html: string): string {
  if (!html) return '';

  // Use DOMParser if available (browser environment)
  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  // Fallback: simple regex-based stripping
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize user input for search queries
 *
 * @param input - The user input string
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potential SQL injection characters (basic protection)
    .replace(/['";\\]/g, '')
    // Limit length
    .substring(0, 100);
}

/**
 * Validate and sanitize book data from API
 *
 * @param bookData - Raw book data from API
 * @returns Sanitized book data
 */
export function sanitizeBookData(bookData: any): any {
  if (!bookData) return bookData;

  const sanitized = { ...bookData };

  // Sanitize string fields that might contain HTML
  if (sanitized.description) {
    sanitized.description = stripHTML(sanitized.description);
  }

  if (sanitized.title) {
    sanitized.title = stripHTML(sanitized.title);
  }

  if (sanitized.author) {
    sanitized.author = stripHTML(sanitized.author);
  }

  return sanitized;
}

/**
 * Escape HTML special characters
 *
 * @param text - The text to escape
 * @returns Escaped text safe for HTML insertion
 */
export function escapeHTML(text: string): string {
  if (!text) return '';

  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
}
