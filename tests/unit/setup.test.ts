import { describe, it, expect } from 'vitest';

describe('Setup verification', () => {
  it('should verify test environment is working', () => {
    expect(true).toBe(true);
  });

  it('should have access to jest-dom matchers', () => {
    const element = document.createElement('div');
    element.textContent = 'test';
    document.body.appendChild(element);
    expect(element).toBeInTheDocument();
    document.body.removeChild(element);
  });

  it('should have mocked localStorage', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    localStorage.clear();
  });

  it('should have mocked crypto.randomUUID', () => {
    const uuid = crypto.randomUUID();
    expect(uuid).toBe('00000000-0000-0000-0000-000000000000');
  });
});
