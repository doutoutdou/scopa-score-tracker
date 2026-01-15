// src/storage/local-storage.ts

import { GameSession, StoredData, StorageError, ValidationError, STORAGE_KEY, SCHEMA_VERSION } from '../core/types';

export function saveGameState(game: GameSession | null): void {
  const data: StoredData = {
    version: SCHEMA_VERSION,
    gameState: game,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageError('localStorage quota exceeded');
    }
    throw new StorageError(`Failed to save game: ${error}`);
  }
}

export function loadGameState(): GameSession | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return null; // No saved game
    }

    const data = JSON.parse(json);
    validateStoredData(data);

    if (data.gameState === null) {
      return null;
    }

    return data.gameState;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new StorageError('Corrupted game data: invalid JSON');
    }
    throw error;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function validateStoredData(data: unknown): asserts data is StoredData {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError("Invalid stored data: not an object");
  }

  const obj = data as Record<string, unknown>;

  if (obj.version !== SCHEMA_VERSION) {
    throw new ValidationError(
      `Unsupported schema version: ${obj.version}. Expected ${SCHEMA_VERSION}`
    );
  }

  if (obj.gameState !== null && typeof obj.gameState !== 'object') {
    throw new ValidationError("Invalid gameState: must be object or null");
  }
}
