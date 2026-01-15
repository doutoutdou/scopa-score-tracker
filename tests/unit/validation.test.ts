import { describe, it, expect } from 'vitest';
import { validatePlayerName, validateScore, validateScoreDelta } from '../../src/core/validation';
import { ValidationError } from '../../src/core/types';

describe('validatePlayerName', () => {
  it('should accept valid player names', () => {
    expect(() => validatePlayerName('Alice')).not.toThrow();
    expect(() => validatePlayerName('Bob')).not.toThrow();
    expect(() => validatePlayerName('Player 1')).not.toThrow();
    expect(() => validatePlayerName('A')).not.toThrow(); // 1 char min
    expect(() => validatePlayerName('A'.repeat(30))).not.toThrow(); // 30 char max
  });

  it('should reject empty names', () => {
    expect(() => validatePlayerName('')).toThrow(ValidationError);
    expect(() => validatePlayerName('')).toThrow('Player name cannot be empty');
  });

  it('should reject whitespace-only names', () => {
    expect(() => validatePlayerName('   ')).toThrow(ValidationError);
    expect(() => validatePlayerName('   ')).toThrow('Player name cannot be empty');
    expect(() => validatePlayerName('\t\n')).toThrow(ValidationError);
  });

  it('should reject names longer than 30 characters', () => {
    const longName = 'A'.repeat(31);
    expect(() => validatePlayerName(longName)).toThrow(ValidationError);
    expect(() => validatePlayerName(longName)).toThrow(/Player name too long.*31.*max 30/);
  });
});

describe('validateScore', () => {
  it('should accept valid scores', () => {
    expect(() => validateScore(0)).not.toThrow();
    expect(() => validateScore(1)).not.toThrow();
    expect(() => validateScore(100)).not.toThrow();
    expect(() => validateScore(9999)).not.toThrow();
  });

  it('should reject negative scores', () => {
    expect(() => validateScore(-1)).toThrow(ValidationError);
    expect(() => validateScore(-1)).toThrow(/Score cannot be negative.*-1/);
    expect(() => validateScore(-100)).toThrow(ValidationError);
  });

  it('should reject non-integer scores', () => {
    expect(() => validateScore(1.5)).toThrow(ValidationError);
    expect(() => validateScore(1.5)).toThrow(/Score must be an integer.*1.5/);
    expect(() => validateScore(0.1)).toThrow(ValidationError);
  });
});

describe('validateScoreDelta', () => {
  it('should accept valid score deltas (1-100)', () => {
    expect(() => validateScoreDelta(1)).not.toThrow();
    expect(() => validateScoreDelta(50)).not.toThrow();
    expect(() => validateScoreDelta(100)).not.toThrow();
  });

  it('should reject score deltas less than 1', () => {
    expect(() => validateScoreDelta(0)).toThrow(ValidationError);
    expect(() => validateScoreDelta(0)).toThrow(/Invalid score change.*0.*Must be between 1 and 100/);
    expect(() => validateScoreDelta(-5)).toThrow(ValidationError);
  });

  it('should reject score deltas greater than 100', () => {
    expect(() => validateScoreDelta(101)).toThrow(ValidationError);
    expect(() => validateScoreDelta(101)).toThrow(/Invalid score change.*101.*Must be between 1 and 100/);
    expect(() => validateScoreDelta(1000)).toThrow(ValidationError);
  });

  it('should reject non-integer deltas', () => {
    expect(() => validateScoreDelta(1.5)).toThrow(ValidationError);
    expect(() => validateScoreDelta(50.7)).toThrow(ValidationError);
  });
});
