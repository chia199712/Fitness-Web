import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface SearchConfig<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

interface SearchResult<T> {
  results: T[];
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  resultsCount: number;
  hasQuery: boolean;
  clearSearch: () => void;
}

export function useSearch<T>({
  data,
  searchFields,
  debounceMs = 300,
  caseSensitive = false,
  exactMatch = false
}: SearchConfig<T>): SearchResult<T> {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  // Filter data based on search query
  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return data;
    }

    const searchTerm = caseSensitive 
      ? debouncedQuery.trim() 
      : debouncedQuery.trim().toLowerCase();

    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value == null) return false;

        const stringValue = caseSensitive 
          ? String(value) 
          : String(value).toLowerCase();

        if (exactMatch) {
          return stringValue === searchTerm;
        }

        return stringValue.includes(searchTerm);
      });
    });
  }, [data, debouncedQuery, searchFields, caseSensitive, exactMatch]);

  // Update searching state
  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [query, debouncedQuery]);

  const clearSearch = () => {
    setQuery('');
  };

  return {
    results: filteredResults,
    query,
    setQuery,
    isSearching,
    resultsCount: filteredResults.length,
    hasQuery: !!debouncedQuery.trim(),
    clearSearch
  };
}

// Advanced search with multiple filters
interface FilterConfig<T> {
  data: T[];
  filters: Record<string, {
    field: keyof T;
    operator: 'equals' | 'includes' | 'greaterThan' | 'lessThan' | 'between';
    value: unknown;
    active: boolean;
  }>;
}

export function useAdvancedSearch<T>(config: FilterConfig<T>) {
  const { data, filters } = config;

  const filteredResults = useMemo(() => {
    return data.filter(item => {
      return Object.values(filters).every(filter => {
        if (!filter.active) return true;

        const itemValue = item[filter.field];

        switch (filter.operator) {
          case 'equals':
            return itemValue === filter.value;
          
          case 'includes':
            return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
          
          case 'greaterThan':
            return Number(itemValue) > Number(filter.value);
          
          case 'lessThan':
            return Number(itemValue) < Number(filter.value);
          
          case 'between': {
            const [min, max] = filter.value as [number, number];
            const numValue = Number(itemValue);
            return numValue >= min && numValue <= max;
          }
          
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  return {
    results: filteredResults,
    resultsCount: filteredResults.length
  };
}

// Full-text search with ranking
interface RankedSearchConfig<T> {
  data: T[];
  searchFields: {
    field: keyof T;
    weight: number;
  }[];
  debounceMs?: number;
}

interface RankedResult<T> {
  item: T;
  score: number;
}

export function useRankedSearch<T>({
  data,
  searchFields,
  debounceMs = 300
}: RankedSearchConfig<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const rankedResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return data.map(item => ({ item, score: 0 }));
    }

    const searchTerm = debouncedQuery.trim().toLowerCase();
    const results: RankedResult<T>[] = [];

    data.forEach(item => {
      let totalScore = 0;

      searchFields.forEach(({ field, weight }) => {
        const value = String(item[field] || '').toLowerCase();
        
        if (value.includes(searchTerm)) {
          // Calculate score based on match position and completeness
          const index = value.indexOf(searchTerm);
          const exactMatch = value === searchTerm;
          const startsWithMatch = index === 0;
          
          let fieldScore = weight;
          
          if (exactMatch) {
            fieldScore *= 3;
          } else if (startsWithMatch) {
            fieldScore *= 2;
          }
          
          // Reduce score based on match position
          fieldScore *= Math.max(0.1, 1 - (index / value.length));
          
          totalScore += fieldScore;
        }
      });

      if (totalScore > 0) {
        results.push({ item, score: totalScore });
      }
    });

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }, [data, debouncedQuery, searchFields]);

  return {
    results: rankedResults.map(r => r.item),
    rankedResults,
    query,
    setQuery,
    hasQuery: !!debouncedQuery.trim(),
    clearSearch: () => setQuery('')
  };
}