// src/core/validation.ts

import { ValidationError, MIN_SCORE_DELTA, MAX_SCORE_DELTA } from './types';

export function validatePlayerName(name: string): void {
  if (!name || !name.trim()) {
    throw new ValidationError("Player name cannot be empty");
  }
  if (name.length > 30) {
    throw new ValidationError(
      `Player name too long: ${name.length} chars (max 30)`
    );
  }
}

export function validateScore(score: number): void {
  if (score < 0) {
    throw new ValidationError(`Score cannot be negative: ${score}`);
  }
  if (!Number.isInteger(score)) {
    throw new ValidationError(`Score must be an integer: ${score}`);
  }
}

export function validateScoreDelta(amount: number): void {
  if (!Number.isInteger(amount)) {
    throw new ValidationError(
      `Invalid score change: ${amount}. Must be an integer between ${MIN_SCORE_DELTA} and ${MAX_SCORE_DELTA}`
    );
  }
  if (amount < MIN_SCORE_DELTA || amount > MAX_SCORE_DELTA) {
    throw new ValidationError(
      `Invalid score change: ${amount}. Must be between ${MIN_SCORE_DELTA} and ${MAX_SCORE_DELTA}`
    );
  }
}
