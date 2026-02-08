import { sanitizeComment, sanitizeHTML } from './html';
import { sanitizeEmail, sanitizeSearchQuery, sanitizeTaskDescription, sanitizeTaskTitle, sanitizeText, sanitizeUsername } from './text';


// Combined sanitization function
export const sanitizeUserInput = (
  input: string,
  type: 'text' | 'html' | 'email' | 'task-title' | 'task-description' | 'comment' | 'username' | 'search'
): string => {
  switch (type) {
    case 'html':
      return sanitizeHTML(input);
    case 'email':
      return sanitizeEmail(input);
    case 'task-title':
      return sanitizeTaskTitle(input);
    case 'task-description':
      return sanitizeTaskDescription(input);
    case 'comment':
      return sanitizeComment(input);
    case 'username':
      return sanitizeUsername(input);
    case 'search':
      return sanitizeSearchQuery(input);
    case 'text':
    default:
      return sanitizeText(input);
  }
};