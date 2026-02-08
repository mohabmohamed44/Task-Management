export interface SanitizeHTMLOptions {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    ALLOW_DATA_ATTR?: boolean;
}

export interface SanitizeTextOptions {
  maxLength?: number;
  allowLineBreaks?: boolean;
  trimWhitespace?: boolean;
  removeExtraSpaces?: boolean;
}