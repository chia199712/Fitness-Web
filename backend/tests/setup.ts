import { jest } from '@jest/globals';

// 設定測試環境變數
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.PORT = '3001';

// 模擬 Google Sheets 服務
jest.mock('../src/services/googleSheets', () => ({
  GoogleSheetsService: {
    getInstance: jest.fn(() => ({
      getSpreadsheet: jest.fn(),
      getWorksheet: jest.fn(),
      addWorksheet: jest.fn(),
      appendRow: jest.fn(),
      updateRow: jest.fn(),
      deleteRow: jest.fn(),
      getRows: jest.fn(),
      clearWorksheet: jest.fn(),
    })),
  },
}));

// 模擬 dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

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
});