import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Replace global localStorage with mock
global.localStorage = localStorageMock as Storage;

// Mock crypto.randomUUID with counter for unique IDs per test run
let uuidCounter = 0;
vi.stubGlobal('crypto', {
  randomUUID: () => {
    const id = uuidCounter.toString().padStart(12, '0');
    uuidCounter++;
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-0000-0000-000000000000`;
  },
});
