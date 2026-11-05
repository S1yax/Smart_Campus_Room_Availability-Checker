import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Remove rendered components from the DOM after each test
afterEach(() => {
  cleanup();
});