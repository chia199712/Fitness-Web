import { useState, useEffect, useCallback, useRef } from 'react';
import type { CacheEntry } from '../types';

interface CacheConfig<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

interface CacheState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isStale: boolean;
}

interface CacheActions<T> {
  mutate: (data?: T) => Promise<void>;
  revalidate: () => Promise<void>;
  clear: () => void;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry>();

export function useCache<T>({
  key,
  fetcher,
  ttl = 5 * 60 * 1000, // 5 minutes default
  staleWhileRevalidate = true,
  revalidateOnFocus = true,
  revalidateOnReconnect = true
}: CacheConfig<T>): [CacheState<T>, CacheActions<T>] {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);

  const fetcherRef = useRef(fetcher);
  const revalidatingRef = useRef(false);

  fetcherRef.current = fetcher;

  // Check if cached data is valid
  const isCacheValid = useCallback((cacheEntry: typeof cache extends Map<string, infer U> ? U : never) => {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl;
  }, []);

  // Load data from cache or fetch
  const loadData = useCallback(async (forceRefresh = false) => {
    const cacheEntry = cache.get(key);
    
    // Use cached data if valid and not forcing refresh
    if (!forceRefresh && cacheEntry && isCacheValid(cacheEntry)) {
      setData(cacheEntry.data as T);
      setIsStale(false);
      return;
    }

    // If we have stale data and staleWhileRevalidate is enabled, show it first
    if (staleWhileRevalidate && cacheEntry && !forceRefresh) {
      setData(cacheEntry.data as T);
      setIsStale(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const newData = await fetcherRef.current();
      
      // Update cache
      cache.set(key, {
        data: newData,
        timestamp: Date.now(),
        ttl
      });

      setData(newData);
      setIsStale(false);
      setError(null);
    } catch (err) {
      setError(err as Error);
      
      // If we don't have cached data, clear data state
      if (!cacheEntry) {
        setData(null);
      }
    } finally {
      setIsLoading(false);
      revalidatingRef.current = false;
    }
  }, [key, ttl, staleWhileRevalidate, isCacheValid]);

  // Revalidate data
  const revalidate = useCallback(async () => {
    if (revalidatingRef.current) return;
    revalidatingRef.current = true;
    await loadData(true);
  }, [loadData]);

  // Mutate data (optimistic updates)
  const mutate = useCallback(async (newData?: T) => {
    if (newData !== undefined) {
      // Optimistic update
      cache.set(key, {
        data: newData,
        timestamp: Date.now(),
        ttl
      });
      setData(newData);
      setIsStale(false);
    }

    // Revalidate in background
    await revalidate();
  }, [key, ttl, revalidate]);

  // Clear cache
  const clear = useCallback(() => {
    cache.delete(key);
    setData(null);
    setIsStale(false);
    setError(null);
  }, [key]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Revalidate on window focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      if (!document.hidden && !revalidatingRef.current) {
        revalidate();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [revalidateOnFocus, revalidate]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => {
      if (!revalidatingRef.current) {
        revalidate();
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [revalidateOnReconnect, revalidate]);

  const state: CacheState<T> = {
    data,
    isLoading,
    error,
    isStale
  };

  const actions: CacheActions<T> = {
    mutate,
    revalidate,
    clear
  };

  return [state, actions];
}

// Global cache management
export const cacheManager = {
  clear: (pattern?: string) => {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of cache.keys()) {
        if (regex.test(key)) {
          cache.delete(key);
        }
      }
    } else {
      cache.clear();
    }
  },
  
  invalidate: (key: string) => {
    const entry = cache.get(key);
    if (entry) {
      entry.timestamp = 0; // Make it immediately stale
    }
  },
  
  get: (key: string) => {
    return cache.get(key);
  },
  
  set: (key: string, data: unknown, ttl = 5 * 60 * 1000) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
};