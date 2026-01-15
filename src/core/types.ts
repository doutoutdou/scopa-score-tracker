// src/core/types.ts

export interface Player {
  readonly name: string;
  readonly score: number;
}

export interface GameSession {
  readonly gameId: string;
  readonly players: readonly Player[];
  readonly createdAt: string;
  readonly lastUpdated: string;
}

export interface StoredData {
  readonly version: string;
  readonly gameState: GameSession | null;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;
export const MIN_SCORE_DELTA = 1;
export const MAX_SCORE_DELTA = 100;
export const STORAGE_KEY = 'scopa-game-state';
export const SCHEMA_VERSION = '1.0.0';
