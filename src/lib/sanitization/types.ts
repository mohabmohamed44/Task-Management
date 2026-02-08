export interface SanitizationConfig {
  html: {
    allowedTags: string[];
    allowedAttributes: string[];
    allowDataAttributes: boolean;
  };
  text: {
    maxLength: number;
    allowLineBreaks: boolean;
    trimWhitespace: boolean;
    removeExtraSpaces: boolean;
  };
}

export interface SanitizationResult {
  original: string;
  sanitized: string;
  wasModified: boolean;
  errors: string[];
}