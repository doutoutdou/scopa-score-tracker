import { describe, it, expect, beforeEach } from 'vitest';
import { saveGameState, loadGameState, clearGameState } from '../../src/storage/local-storage';
import { createNewGame } from '../../src/core/game-session';
import { GameSession, StorageError, ValidationError } from '../../src/core/types';

describe('localStorage service', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveGameState', () => {
    it('should save game state to localStorage', () => {
      const game = createNewGame();

      saveGameState(game);

      const stored = localStorage.getItem('scopa-game-state');
      expect(stored).toBeDefined();
      expect(stored).not.toBeNull();
    });

    it('should save with version 1.0.0', () => {
      const game = createNewGame();

      saveGameState(game);

      const stored = JSON.parse(localStorage.getItem('scopa-game-state')!);
      expect(stored.version).toBe('1.0.0');
    });

    it('should save the game state', () => {
      const game = createNewGame();

      saveGameState(game);

      const stored = JSON.parse(localStorage.getItem('scopa-game-state')!);
      expect(stored.gameState).toEqual(game);
    });

    it('should save null game state', () => {
      saveGameState(null);

      const stored = JSON.parse(localStorage.getItem('scopa-game-state')!);
      expect(stored.gameState).toBeNull();
    });

    it('should throw StorageError on quota exceeded', () => {
      // Mock setItem to throw QuotaExceededError
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      };

      const game = createNewGame();
      expect(() => saveGameState(game)).toThrow(StorageError);
      expect(() => saveGameState(game)).toThrow('localStorage quota exceeded');

      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });

  describe('loadGameState', () => {
    it('should return null when no game is saved', () => {
      const game = loadGameState();

      expect(game).toBeNull();
    });

    it('should load saved game state', () => {
      const originalGame = createNewGame();
      saveGameState(originalGame);

      const loadedGame = loadGameState();

      expect(loadedGame).toEqual(originalGame);
    });

    it('should load null game state', () => {
      saveGameState(null);

      const game = loadGameState();

      expect(game).toBeNull();
    });

    it('should throw StorageError on corrupted JSON', () => {
      localStorage.setItem('scopa-game-state', 'invalid json{');

      expect(() => loadGameState()).toThrow(StorageError);
      expect(() => loadGameState()).toThrow('Corrupted game data: invalid JSON');
    });

    it('should throw ValidationError on wrong version', () => {
      const data = {
        version: '2.0.0',
        gameState: null
      };
      localStorage.setItem('scopa-game-state', JSON.stringify(data));

      expect(() => loadGameState()).toThrow(ValidationError);
      expect(() => loadGameState()).toThrow(/Unsupported schema version.*2.0.0.*Expected 1.0.0/);
    });

    it('should validate game session structure', () => {
      const game = createNewGame();
      saveGameState(game);

      const loaded = loadGameState();

      expect(loaded).toHaveProperty('gameId');
      expect(loaded).toHaveProperty('players');
      expect(loaded).toHaveProperty('createdAt');
      expect(loaded).toHaveProperty('lastUpdated');
    });
  });

  describe('clearGameState', () => {
    it('should remove game state from localStorage', () => {
      const game = createNewGame();
      saveGameState(game);

      clearGameState();

      const stored = localStorage.getItem('scopa-game-state');
      expect(stored).toBeNull();
    });

    it('should not throw error if no game is saved', () => {
      expect(() => clearGameState()).not.toThrow();
    });
  });

  describe('round-trip serialization', () => {
    it('should preserve game state through save and load', () => {
      const originalGame: GameSession = {
        gameId: 'test-id',
        players: [
          { name: 'Alice', score: 5 },
          { name: 'Bob', score: 10 }
        ],
        createdAt: '2026-01-14T10:00:00Z',
        lastUpdated: '2026-01-14T10:15:00Z'
      };

      saveGameState(originalGame);
      const loadedGame = loadGameState();

      expect(loadedGame).toEqual(originalGame);
    });
  });
});
