import { encrypt, decrypt } from '@/lib/crypto';

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const validateStructure = (parsed: unknown): boolean => {
  // Reject prototype pollution attempts
  if (isPlainObject(parsed)) {
    const keys = Object.keys(parsed);
    const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];
    return !keys.some(key => forbiddenKeys.includes(key));
  }
  return true;
};

export const LocalStorageService = {
  setItem: <T>(key: string, value: T) => {
    try {
      const serializedValue = JSON.stringify(value);
      const encrypted = encrypt(serializedValue);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Error Saving to local Storage", error);
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const decrypted = decrypt(item);
      const parsed = JSON.parse(decrypted);
      // Validate structure to prevent prototype pollution
      return validateStructure(parsed) ? (parsed as T) : null;
    } catch (error) {
      console.error("Error reading from local Storage", error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from local storage", error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error Cleaning from local Storage", error);
    }
  },
};
