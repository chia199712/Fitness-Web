import { Request, Response, NextFunction } from 'express';

// Extended Request interface with user property for authenticated routes
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Mock Express Request type for testing
export interface MockRequest extends Partial<Request> {
  params?: Record<string, string>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  user?: {
    id: string;
    email: string;
  };
}

// Mock Express Response type for testing
export interface MockResponse extends Partial<Response> {
  status: jest.Mock<Response, [number]>;
  json: jest.Mock<Response, [any]>;
  send: jest.Mock<Response, [any]>;
  cookie?: jest.Mock<Response, [string, any, any?]>;
  clearCookie?: jest.Mock<Response, [string, any?]>;
}

// Mock Next Function type
export type MockNextFunction = jest.Mock<void, [Error?]>;

// Helper function to create mock request
export const createMockRequest = (overrides: Partial<MockRequest> = {}): MockRequest => ({
  params: {},
  query: {},
  body: {},
  ...overrides,
});

// Helper function to create mock response
export const createMockResponse = (): MockResponse => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
});

// Helper function to create mock next function
export const createMockNext = (): MockNextFunction => jest.fn();