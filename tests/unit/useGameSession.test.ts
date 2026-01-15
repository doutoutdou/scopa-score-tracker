import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameSession } from '../../src/hooks/useGameSession';
import { clearGameState } from '../../src/storage/local-storage';
import { ValidationError } from '../../src/core/types';

describe('useGameSession', () => {
  beforeEach(() => {
    clearGameState();
  });

  it('should initialize with null game state', () => {
    const { result } = renderHook(() => useGameSession());

    expect(result.current.game).toBeNull();
    expect(result.current.players).toEqual([]);
  });

  it('should create a new game', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.game).not.toBeNull();
    expect(result.current.game?.gameId).toBeDefined();
    expect(result.current.game?.players).toEqual([]);
  });

  it('should add a player to the game', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    expect(result.current.players.length).toBe(1);
    expect(result.current.players[0].name).toBe('Alice');
    expect(result.current.players[0].score).toBe(0);
  });

  it('should add multiple players', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    act(() => {
      result.current.addPlayerToGame('Bob');
    });

    act(() => {
      result.current.addPlayerToGame('Carol');
    });

    expect(result.current.players.length).toBe(3);
    expect(result.current.players[0].name).toBe('Alice');
    expect(result.current.players[1].name).toBe('Bob');
    expect(result.current.players[2].name).toBe('Carol');
  });

  it('should throw ValidationError for duplicate player names', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    expect(() => {
      act(() => {
        result.current.addPlayerToGame('Alice');
      });
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError for empty player names', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    expect(() => {
      act(() => {
        result.current.addPlayerToGame('');
      });
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError when adding 5th player', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    act(() => {
      result.current.addPlayerToGame('Bob');
    });

    act(() => {
      result.current.addPlayerToGame('Carol');
    });

    act(() => {
      result.current.addPlayerToGame('David');
    });

    expect(() => {
      act(() => {
        result.current.addPlayerToGame('Eve');
      });
    }).toThrow(ValidationError);
  });

  it('should persist game state to localStorage when adding players', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    // Verify saved to localStorage
    const stored = localStorage.getItem('scopa-game-state');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.gameState.players.length).toBe(1);
    expect(parsed.gameState.players[0].name).toBe('Alice');
  });

  it('should load existing game state on mount', () => {
    // Setup: Create and save a game with players
    const { result: result1 } = renderHook(() => useGameSession());

    act(() => {
      result1.current.startNewGame();
    });

    act(() => {
      result1.current.addPlayerToGame('Alice');
    });

    act(() => {
      result1.current.addPlayerToGame('Bob');
    });

    // Simulate page reload by mounting a new hook instance
    const { result: result2 } = renderHook(() => useGameSession());

    // Should load the saved game
    expect(result2.current.game).not.toBeNull();
    expect(result2.current.players.length).toBe(2);
    expect(result2.current.players[0].name).toBe('Alice');
    expect(result2.current.players[1].name).toBe('Bob');
  });

  it('should clear game state when starting a new game after existing game', () => {
    const { result } = renderHook(() => useGameSession());

    // Create first game
    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    const firstGameId = result.current.game?.gameId;

    // Start new game (should replace the old one)
    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.game?.gameId).not.toBe(firstGameId);
    expect(result.current.players.length).toBe(0);
  });

  it('should validate game has enough players', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    // Game with 0 players is invalid
    expect(result.current.isGameValid()).toBe(false);

    // Game with 1 player is invalid
    act(() => {
      result.current.addPlayerToGame('Alice');
    });
    expect(result.current.isGameValid()).toBe(false);

    // Game with 2 players is valid
    act(() => {
      result.current.addPlayerToGame('Bob');
    });
    expect(result.current.isGameValid()).toBe(true);
  });

  it('should not allow adding players when game is null', () => {
    const { result } = renderHook(() => useGameSession());

    expect(() => {
      act(() => {
        result.current.addPlayerToGame('Alice');
      });
    }).toThrow('No game session active');
  });

  it('should return empty players array when game is null', () => {
    const { result } = renderHook(() => useGameSession());

    expect(result.current.players).toEqual([]);
  });

  it('should persist game state to localStorage when creating new game', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    // Verify saved to localStorage
    const stored = localStorage.getItem('scopa-game-state');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.gameState.gameId).toBe(result.current.game?.gameId);
  });

  // Scoring tests
  it('should add points to a player', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    act(() => {
      result.current.addPlayerToGame('Bob');
    });

    act(() => {
      result.current.addPoints('Alice', 5);
    });

    expect(result.current.players[0].score).toBe(5);
    expect(result.current.players[1].score).toBe(0);
  });

  it('should accumulate points for a player', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    act(() => {
      result.current.addPlayerToGame('Bob');
    });

    act(() => {
      result.current.addPoints('Alice', 5);
    });

    act(() => {
      result.current.addPoints('Alice', 3);
    });

    act(() => {
      result.current.addPoints('Alice', 2);
    });

    expect(result.current.players[0].score).toBe(10);
  });

  it('should persist score changes to localStorage', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    act(() => {
      result.current.addPlayerToGame('Bob');
    });

    act(() => {
      result.current.addPoints('Alice', 7);
    });

    // Verify saved to localStorage
    const stored = localStorage.getItem('scopa-game-state');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.gameState.players[0].score).toBe(7);
  });

  it('should throw ValidationError when adding points with no game', () => {
    const { result } = renderHook(() => useGameSession());

    expect(() => {
      act(() => {
        result.current.addPoints('Alice', 5);
      });
    }).toThrow('No game session active');
  });

  it('should throw ValidationError for non-existent player', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    expect(() => {
      act(() => {
        result.current.addPoints('Bob', 5);
      });
    }).toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid score delta', () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.addPlayerToGame('Alice');
    });

    expect(() => {
      act(() => {
        result.current.addPoints('Alice', 0);
      });
    }).toThrow(ValidationError);

    expect(() => {
      act(() => {
        result.current.addPoints('Alice', 101);
      });
    }).toThrow(ValidationError);
  });
});
