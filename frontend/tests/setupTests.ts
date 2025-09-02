import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// 模擬 window.matchMedia (Tailwind CSS 需要)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 模擬 IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// 模擬 ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// 模擬 localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

// 模擬 sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock as Storage;

// 模擬 fetch API
global.fetch = jest.fn();

// 設定全域 console 過濾
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // 過濾掉測試期間的 console 輸出
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // 恢復原始 console
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// 全域測試清理
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});