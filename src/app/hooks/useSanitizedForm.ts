import { sanitizeUserInput } from "@/lib/sanitization";
import { useCallback } from "react";

export const useSanitizedForm = <T extends Record<string, string>>(
  fields: { [K in keyof T]: 'text' | 'html' | 'email' | 'task-title' | 'task-description' | 'comment' | 'username' | 'search' }
) => {
    const sanitizeValues = useCallback((values: T): T => {
        const sanitize: T = {} as T;

        for(const key in values) {
            if (fields[key] && typeof values[key] === 'string') {
                sanitize[key] = sanitizeUserInput(values[key], fields[key]) as T[Extract<keyof T, string>];
            } else {
                sanitize[key] = values[key];
            }
        }

        return sanitize;
    }, [fields]);

    return { sanitizeValues };
}