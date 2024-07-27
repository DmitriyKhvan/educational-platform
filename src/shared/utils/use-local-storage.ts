import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      try {
        // Assert the parsed type as T
        return JSON.parse(item) as T;
      } catch (err) {
        console.error(`Error parsing the localStorage key "${key}":`, err);
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch (err) {
          console.error(`Error parsing the localStorage key "${key}" on storage event:`, err);
        }
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [key]);
  const setStoredValue = (valueOrFunc: T | ((prevValue: T) => T)) => {
    try {
      // Handle functional updates
      const newValue = valueOrFunc instanceof Function ? valueOrFunc(value) : valueOrFunc;
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      console.error(`Error setting the localStorage key "${key}":`, err);
    }
  };

  return [value, setStoredValue];
}
