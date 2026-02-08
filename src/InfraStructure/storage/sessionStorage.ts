export const SessionStorageService = {
  setItem: <T>(key: string, value: T) => {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error Saving to Session Storage", error);
    }
  },
  getItem: <T>(key: string): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error("Error reading from Session Storage", error);
      return null;
    }
  },
  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from Session Storage", error);
    }
  },
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Error Cleaning from Session Storage", error);
    }
  },
};
