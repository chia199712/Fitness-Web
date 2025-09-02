// Class name utilities
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Async utilities
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await delay(delayMs);
    return retry(fn, retries - 1, delayMs);
  }
};

// Array utilities
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((result, item) => {
    const group = key(item);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<K, T[]>);
};

export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const sortBy = <T>(
  array: T[],
  key: (item: T) => string | number | Date,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = key(a);
    const bVal = key(b);
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Object utilities
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

// URL utilities
export const buildUrl = (base: string, params: Record<string, unknown>): string => {
  const url = new URL(base, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v.toString()));
      } else {
        url.searchParams.append(key, value.toString());
      }
    }
  });
  return url.toString();
};

export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// File utilities
export const downloadFile = (data: Blob | string, filename: string): void => {
  const blob = typeof data === 'string' 
    ? new Blob([data], { type: 'text/plain' })
    : data;
    
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Math utilities
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const round = (value: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

export const sum = (numbers: number[]): number => {
  return numbers.reduce((total, num) => total + num, 0);
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Local Storage utilities
export const safeJsonParse = <T>(str: string | null, fallback: T): T => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (obj: unknown): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '';
  }
};

// Device detection
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isTablet = (): boolean => {
  return /iPad|Android(?=.*Mobile)/i.test(navigator.userAgent);
};

export const isDesktop = (): boolean => {
  return !isMobile() && !isTablet();
};