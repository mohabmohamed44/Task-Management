import type { SanitizeTextOptions } from "@/domain/entities/Sanitizarion.dto";


export const sanitizeText = (text: string, options: SanitizeTextOptions = {}): string => {
  const {
    maxLength,
    allowLineBreaks = false,
    trimWhitespace = true,
    removeExtraSpaces = true
  } = options;

  let sanitized = text;

    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s]/g, '');
    // Handle line breaks
    if (!allowLineBreaks) {
        sanitized = sanitized.replace(/[\r\n]/g, ' ');
    }

  // Remove extra spaces
  if (removeExtraSpaces) {
    sanitized = sanitized.replace(/\s+/g, ' ');
  }

  // Trim whitespace
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }

  // Apply max length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  // Only trim whitespace for emails, don't remove special characters
  let sanitized = email.trim();
  
  // Remove line breaks but keep @ and . characters
  sanitized = sanitized.replace(/[\r\n]/g, ' ');
  
  // Apply max length limit (RFC 5321 limit)
  if (sanitized.length > 254) {
    sanitized = sanitized.substring(0, 254);
  }

  return sanitized.toLowerCase();
};

export const sanitizeTaskTitle = (title: string): string => {
  return sanitizeText(title, {
    maxLength: 200,
    allowLineBreaks: false,
    trimWhitespace: true,
    removeExtraSpaces: true
  });
};

export const sanitizeTaskDescription = (description: string): string => {
  return sanitizeText(description, {
    maxLength: 2000,
    allowLineBreaks: true,
    trimWhitespace: true,
    removeExtraSpaces: true
  });
};

export const sanitizeUsername = (username: string): string => {
  const sanitized = sanitizeText(username, {
    maxLength: 50,
    allowLineBreaks: false,
    trimWhitespace: true,
    removeExtraSpaces: false
  });

  // Allow only alphanumeric characters, underscores, and hyphens
  return sanitized.replace(/[^a-zA-Z0-9_-]/g, '');
};

export const sanitizeSearchQuery = (query: string): string => {
  return sanitizeText(query, {
    maxLength: 100,
    allowLineBreaks: false,
    trimWhitespace: true,
    removeExtraSpaces: true
  });
};