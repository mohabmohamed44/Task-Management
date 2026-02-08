import type { SanitizeHTMLOptions } from "@/domain/entities/Sanitizarion.dto"
import DOMPurify from "dompurify";
const  defaultHTMLConfig: SanitizeHTMLOptions = {
    ALLOWED_TAGS: [
        "a",
        "b",
        "code",
        "em",
        "i",
        "p",
        "strong",
        "ul",
        "ol",
        "li",
        "img",
        "hr",
        "pre",
        "blockquote",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "div",
        "span",
        "em",
        "strong",
        "u",
        "s",
        "strike",
        "sub",
        "sup",
        "small",
        "big",
        "font",
        "blockquote",
        "cite",
        "q",
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
    ALLOW_DATA_ATTR: false
};

export const sanitizeHTML = (dirty: string, options: SanitizeHTMLOptions = {}) : string => {
    const config = {...defaultHTMLConfig, ...options};

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: config.ALLOWED_TAGS,
        ALLOWED_ATTR: config.ALLOWED_ATTR,
        ALLOW_DATA_ATTR: config.ALLOW_DATA_ATTR,
        KEEP_CONTENT: true,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false
    });
};

export const sanitizeRichText = (content: string): string => {
  return sanitizeHTML(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'i', 'b',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'a', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id']
  });
};
 
export const sanitizeComment = (comment: string): string => {
  return sanitizeHTML(comment, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'i', 'code', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};