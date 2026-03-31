/**
 * Simple encryption/decryption utility for localStorage/sessionStorage
 * Uses XOR cipher for synchronous operations (obfuscation-level security)
 * 
 * IMPORTANT: This provides obfuscation, not military-grade security.
 * For production apps with sensitive data, use Web Crypto API with proper key management.
 */

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET || 'default-secret-key-min-32-chars-long!!';

/**
 * Synchronously encrypt text using XOR cipher
 * Simple and fast for localStorage operations
 */
export const encrypt = (text: string): string => {
  try {
    const key = SECRET_KEY;
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result);
  } catch {
    return text;
  }
};

/**
 * Synchronously decrypt text using XOR cipher
 * Falls back to returning input if decryption fails (backward compatibility)
 */
export const decrypt = (encryptedText: string): string => {
  try {
    const key = SECRET_KEY;
    const text = atob(encryptedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  } catch {
    // If decryption fails, return as-is (backward compatibility)
    return encryptedText;
  }
};
