// Test setup file
process.env.NODE_ENV = 'test';

// Mock console methods during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.setTimeout(10000);
