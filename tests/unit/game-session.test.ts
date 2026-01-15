import { describe, it, expect, beforeEach } from 'vitest';
import { createNewGame, addPlayer, getPlayers, validateGameSession } from '../../src/core/game-session';
import { GameSession, ValidationError } from '../../src/core/types';

describe('createNewGame', () => {
  it('should create a new game with empty players array', () => {
    const game = createNewGame();

    expect(game.players).toEqual([]);
    expect(game.players.length).toBe(0);
  });

  it('should generate a UUID for gameId', () => {
    const game = createNewGame();

    // Should return a valid UUID format
    expect(game.gameId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('should set createdAt timestamp', () => {
    const before = new Date().toISOString();
    const game = createNewGame();
    const after = new Date().toISOString();

    expect(game.createdAt).toBeDefined();
    expect(game.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO format
    expect(game.createdAt >= before).toBe(true);
    expect(game.createdAt <= after).toBe(true);
  });

  it('should set lastUpdated equal to createdAt', () => {
    const game = createNewGame();

    expect(game.lastUpdated).toBe(game.createdAt);
  });

  it('should create a new game with all required fields', () => {
    const game = createNewGame();

    expect(game).toHaveProperty('gameId');
    expect(game).toHaveProperty('players');
    expect(game).toHaveProperty('createdAt');
    expect(game).toHaveProperty('lastUpdated');
  });
});

describe('addPlayer', () => {
  let game: GameSession;

  beforeEach(() => {
    game = createNewGame();
  });

  it('should add a player to an empty game', () => {
    const updatedGame = addPlayer(game, 'Alice');

    expect(updatedGame.players.length).toBe(1);
    expect(updatedGame.players[0].name).toBe('Alice');
    expect(updatedGame.players[0].score).toBe(0);
  });

  it('should add multiple players', () => {
    let updatedGame = addPlayer(game, 'Alice');
    updatedGame = addPlayer(updatedGame, 'Bob');
    updatedGame = addPlayer(updatedGame, 'Carol');

    expect(updatedGame.players.length).toBe(3);
    expect(updatedGame.players[0].name).toBe('Alice');
    expect(updatedGame.players[1].name).toBe('Bob');
    expect(updatedGame.players[2].name).toBe('Carol');
  });

  it('should initialize new players with score 0 (FR-004)', () => {
    const updatedGame = addPlayer(game, 'Alice');

    expect(updatedGame.players[0].score).toBe(0);
  });

  it('should reject duplicate player names (FR-003)', () => {
    const gameWithAlice = addPlayer(game, 'Alice');

    expect(() => addPlayer(gameWithAlice, 'Alice')).toThrow(ValidationError);
    expect(() => addPlayer(gameWithAlice, 'Alice')).toThrow(/Player 'Alice' already exists/);
  });

  it('should reject empty player names', () => {
    expect(() => addPlayer(game, '')).toThrow(ValidationError);
    expect(() => addPlayer(game, '')).toThrow('Player name cannot be empty');
  });

  it('should reject whitespace-only player names', () => {
    expect(() => addPlayer(game, '   ')).toThrow(ValidationError);
  });

  it('should reject names longer than 30 characters', () => {
    const longName = 'A'.repeat(31);
    expect(() => addPlayer(game, longName)).toThrow(ValidationError);
    expect(() => addPlayer(game, longName)).toThrow(/Player name too long/);
  });

  it('should enforce maximum 4 players (FR-009)', () => {
    let updatedGame = game;
    updatedGame = addPlayer(updatedGame, 'Alice');
    updatedGame = addPlayer(updatedGame, 'Bob');
    updatedGame = addPlayer(updatedGame, 'Carol');
    updatedGame = addPlayer(updatedGame, 'David');

    expect(() => addPlayer(updatedGame, 'Eve')).toThrow(ValidationError);
    expect(() => addPlayer(updatedGame, 'Eve')).toThrow(/game already has 4 players/);
  });

  it('should update lastUpdated timestamp', () => {
    const originalTime = game.lastUpdated;

    // Wait 1ms to ensure different timestamp
    const start = Date.now();
    while (Date.now() === start) {
      // Busy wait for 1ms
    }

    const updatedGame = addPlayer(game, 'Alice');

    expect(updatedGame.lastUpdated).not.toBe(originalTime);
    expect(updatedGame.lastUpdated >= originalTime).toBe(true);
  });

  it('should return a new GameSession (immutability)', () => {
    const updatedGame = addPlayer(game, 'Alice');

    expect(updatedGame).not.toBe(game);
    expect(game.players.length).toBe(0); // Original unchanged
    expect(updatedGame.players.length).toBe(1);
  });

  it('should not mutate original game', () => {
    const originalPlayers = game.players;
    addPlayer(game, 'Alice');

    expect(game.players).toBe(originalPlayers);
    expect(game.players.length).toBe(0);
  });
});

describe('getPlayers', () => {
  it('should return empty array for new game', () => {
    const game = createNewGame();
    const players = getPlayers(game);

    expect(players).toEqual([]);
    expect(players.length).toBe(0);
  });

  it('should return all players from game', () => {
    let game = createNewGame();
    game = addPlayer(game, 'Alice');
    game = addPlayer(game, 'Bob');

    const players = getPlayers(game);

    expect(players.length).toBe(2);
    expect(players[0].name).toBe('Alice');
    expect(players[1].name).toBe('Bob');
  });

  it('should return readonly array (immutable)', () => {
    let game = createNewGame();
    game = addPlayer(game, 'Alice');

    const players = getPlayers(game);

    // TypeScript ensures this is readonly at compile time
    expect(Array.isArray(players)).toBe(true);
  });
});

describe('validateGameSession', () => {
  it('should accept valid game with 2 players', () => {
    let game = createNewGame();
    game = addPlayer(game, 'Alice');
    game = addPlayer(game, 'Bob');

    expect(() => validateGameSession(game)).not.toThrow();
  });

  it('should accept valid game with 4 players', () => {
    let game = createNewGame();
    game = addPlayer(game, 'Alice');
    game = addPlayer(game, 'Bob');
    game = addPlayer(game, 'Carol');
    game = addPlayer(game, 'David');

    expect(() => validateGameSession(game)).not.toThrow();
  });

  it('should reject game with less than 2 players (FR-009)', () => {
    const game = createNewGame();

    expect(() => validateGameSession(game)).toThrow(ValidationError);
    expect(() => validateGameSession(game)).toThrow(/Game requires at least 2 players.*got 0/);
  });

  it('should reject game with 1 player (FR-009)', () => {
    let game = createNewGame();
    game = addPlayer(game, 'Alice');

    expect(() => validateGameSession(game)).toThrow(ValidationError);
    expect(() => validateGameSession(game)).toThrow(/Game requires at least 2 players.*got 1/);
  });

  it('should reject game with more than 4 players (FR-009)', () => {
    const game: GameSession = {
      gameId: 'test-id',
      players: [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 },
        { name: 'Carol', score: 0 },
        { name: 'David', score: 0 },
        { name: 'Eve', score: 0 }
      ],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    expect(() => validateGameSession(game)).toThrow(ValidationError);
    expect(() => validateGameSession(game)).toThrow(/Game supports maximum 4 players.*got 5/);
  });

  it('should reject game with duplicate player names', () => {
    const game: GameSession = {
      gameId: 'test-id',
      players: [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 },
        { name: 'Alice', score: 5 }
      ],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    expect(() => validateGameSession(game)).toThrow(ValidationError);
    expect(() => validateGameSession(game)).toThrow(/Duplicate player names.*Alice/);
  });
});
