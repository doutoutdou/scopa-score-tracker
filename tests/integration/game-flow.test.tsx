import { describe, it, expect, beforeEach } from 'vitest';
import { createNewGame, addPlayer } from '../../src/core/game-session';
import { saveGameState, loadGameState, clearGameState } from '../../src/storage/local-storage';

describe('Game Setup Flow (Integration)', () => {
  beforeEach(() => {
    clearGameState();
  });

  it('should complete full game setup flow', () => {
    // Step 1: Create new game
    const game = createNewGame();
    expect(game.players.length).toBe(0);

    // Wait 1ms to ensure different timestamp
    const start = Date.now();
    while (Date.now() === start) {
      // Busy wait for 1ms
    }

    // Step 2: Add first player
    const gameWith1 = addPlayer(game, 'Alice');
    expect(gameWith1.players.length).toBe(1);
    expect(gameWith1.players[0].name).toBe('Alice');
    expect(gameWith1.players[0].score).toBe(0);

    // Step 3: Add second player
    const gameWith2 = addPlayer(gameWith1, 'Bob');
    expect(gameWith2.players.length).toBe(2);
    expect(gameWith2.players[1].name).toBe('Bob');
    expect(gameWith2.players[1].score).toBe(0);

    // Step 4: Verify game state
    expect(gameWith2.gameId).toBeDefined();
    expect(gameWith2.createdAt).toBeDefined();
    expect(gameWith2.lastUpdated).toBeDefined();
    expect(gameWith2.lastUpdated).not.toBe(game.createdAt); // Updated after adding players
  });

  it('should persist game state to localStorage', () => {
    // Create game and add players
    let game = createNewGame();
    game = addPlayer(game, 'Alice');
    game = addPlayer(game, 'Bob');

    // Save to localStorage
    saveGameState(game);

    // Verify saved
    const stored = localStorage.getItem('scopa-game-state');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.gameState.players.length).toBe(2);
  });

  it('should load game state from localStorage', () => {
    // Create and save game
    let game = createNewGame();
    game = addPlayer(game, 'Alice');
    game = addPlayer(game, 'Bob');
    game = addPlayer(game, 'Carol');
    saveGameState(game);

    // Load from localStorage
    const loadedGame = loadGameState();

    // Verify loaded state matches
    expect(loadedGame).not.toBeNull();
    expect(loadedGame!.gameId).toBe(game.gameId);
    expect(loadedGame!.players.length).toBe(3);
    expect(loadedGame!.players[0].name).toBe('Alice');
    expect(loadedGame!.players[1].name).toBe('Bob');
    expect(loadedGame!.players[2].name).toBe('Carol');
    expect(loadedGame!.createdAt).toBe(game.createdAt);
  });

  it('should handle save and load round-trip', () => {
    // Create game with players
    let game = createNewGame();
    game = addPlayer(game, 'Player 1');
    game = addPlayer(game, 'Player 2');
    game = addPlayer(game, 'Player 3');
    game = addPlayer(game, 'Player 4');

    // Save
    saveGameState(game);

    // Load
    const loadedGame = loadGameState();

    // Verify exact match
    expect(loadedGame).toEqual(game);
  });

  it('should handle multiple save operations', () => {
    // Create game
    let game = createNewGame();
    saveGameState(game);

    // Add player and save
    game = addPlayer(game, 'Alice');
    saveGameState(game);

    // Add another player and save
    game = addPlayer(game, 'Bob');
    saveGameState(game);

    // Load and verify latest state
    const loadedGame = loadGameState();
    expect(loadedGame!.players.length).toBe(2);
    expect(loadedGame!.players[0].name).toBe('Alice');
    expect(loadedGame!.players[1].name).toBe('Bob');
  });

  it('should handle clear and restart flow', () => {
    // Setup initial game
    let game = createNewGame();
    game = addPlayer(game, 'Alice');
    game = addPlayer(game, 'Bob');
    saveGameState(game);

    // Clear
    clearGameState();

    // Verify cleared
    const loaded = loadGameState();
    expect(loaded).toBeNull();

    // Start new game
    const newGame = createNewGame();
    expect(newGame.players.length).toBe(0);
    expect(newGame.gameId).not.toBe(game.gameId); // Different game
  });

  it('should maintain data integrity through save/load cycle', () => {
    // Create game with specific data
    const originalGame = createNewGame();
    const gameWithPlayers = addPlayer(
      addPlayer(originalGame, 'Alice'),
      'Bob'
    );

    // Save
    saveGameState(gameWithPlayers);

    // Load
    const loadedGame = loadGameState()!;

    // Verify all fields preserved
    expect(loadedGame.gameId).toBe(gameWithPlayers.gameId);
    expect(loadedGame.players).toEqual(gameWithPlayers.players);
    expect(loadedGame.createdAt).toBe(gameWithPlayers.createdAt);
    expect(loadedGame.lastUpdated).toBe(gameWithPlayers.lastUpdated);

    // Verify player details
    expect(loadedGame.players[0].name).toBe('Alice');
    expect(loadedGame.players[0].score).toBe(0);
    expect(loadedGame.players[1].name).toBe('Bob');
    expect(loadedGame.players[1].score).toBe(0);
  });
});
