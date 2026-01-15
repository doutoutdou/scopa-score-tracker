import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../src/hooks/useLocalStorage';
import { clearGameState } from '../../src/storage/local-storage';
import { createNewGame, addPlayer } from '../../src/core/game-session';

describe('useLocalStorage', () => {
  beforeEach(() => {
    clearGameState();
  });

  it('should return null initially when no game is saved', () => {
    const { result } = renderHook(() => useLocalStorage());

    expect(result.current.gameState).toBeNull();
  });

  it('should load saved game state on mount', () => {
    // Save a game to localStorage before mounting
    const game = createNewGame();
    const gameWithPlayer = addPlayer(game, 'Alice');
    localStorage.setItem(
      'scopa-game-state',
      JSON.stringify({ version: '1.0.0', gameState: gameWithPlayer })
    );

    const { result } = renderHook(() => useLocalStorage());

    expect(result.current.gameState).not.toBeNull();
    expect(result.current.gameState?.players.length).toBe(1);
    expect(result.current.gameState?.players[0].name).toBe('Alice');
  });

  it('should save game state when saveGame is called', () => {
    const { result } = renderHook(() => useLocalStorage());

    const game = createNewGame();
    const gameWithPlayer = addPlayer(game, 'Alice');

    act(() => {
      result.current.saveGame(gameWithPlayer);
    });

    // Verify saved to localStorage
    const stored = localStorage.getItem('scopa-game-state');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.gameState.players.length).toBe(1);
    expect(parsed.gameState.players[0].name).toBe('Alice');

    // Verify state updated
    expect(result.current.gameState).toEqual(gameWithPlayer);
  });

  it('should clear game state when clearGame is called', () => {
    const { result } = renderHook(() => useLocalStorage());

    // First save a game
    const game = createNewGame();
    act(() => {
      result.current.saveGame(game);
    });

    expect(result.current.gameState).not.toBeNull();

    // Then clear it
    act(() => {
      result.current.clearGame();
    });

    expect(result.current.gameState).toBeNull();
    expect(localStorage.getItem('scopa-game-state')).toBeNull();
  });

  it('should handle save and load round-trip', () => {
    const { result } = renderHook(() => useLocalStorage());

    const game = createNewGame();
    let updatedGame = addPlayer(game, 'Alice');
    updatedGame = addPlayer(updatedGame, 'Bob');

    // Save
    act(() => {
      result.current.saveGame(updatedGame);
    });

    // Clear and remount to simulate page reload
    const { result: result2 } = renderHook(() => useLocalStorage());

    // Verify loaded state matches saved
    expect(result2.current.gameState).toEqual(updatedGame);
  });

  it('should update state when saving null', () => {
    const { result } = renderHook(() => useLocalStorage());

    // First save a game
    const game = createNewGame();
    act(() => {
      result.current.saveGame(game);
    });

    expect(result.current.gameState).not.toBeNull();

    // Save null
    act(() => {
      result.current.saveGame(null);
    });

    expect(result.current.gameState).toBeNull();
  });
});
