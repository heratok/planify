import { useState } from 'react';

// Helper function to parse JSON with Date objects
function parseJSONWithDates<T>(jsonString: string): T {
  return JSON.parse(jsonString, (_key, value) => {
    // Check if the value is a string that looks like an ISO date
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      return new Date(value);
    }
    return value;
  });
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      try {
        return parseJSONWithDates<T>(item);
      } catch {
        // If JSON parsing fails, return the raw string if T is string, otherwise initialValue
        return (typeof initialValue === 'string' ? item : initialValue) as T;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [sidebarOpen, setSidebarOpen] = useLocalStorage<boolean>(
    'sidebarOpen',
    false
  );
  const [activePage, setActivePage] = useLocalStorage<string>(
    'activePage',
    'Dashboard'
  );

  return {
    theme,
    setTheme,
    sidebarOpen,
    setSidebarOpen,
    activePage,
    setActivePage,
  };
}
