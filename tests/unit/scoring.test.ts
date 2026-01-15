import { describe, it, expect, beforeEach } from 'vitest';
import { updatePlayerScore } from '../../src/core/scoring';
import { createNewGame, addPlayer } from '../../src/core/game-session';
import { GameSession, ValidationError } from '../../src/core/types';

describe('updatePlayerScore', () => {
  let game: GameSession;

  beforeEach(() => {
    game = createNewGame();
    game = addPlayer(game, 'Alice');
    game = addPlayer(game, 'Bob');
  });

  it('should add points to a player', () => {
    const updatedGame = updatePlayerScore(game, 'Alice', 5);

    expect(updatedGame.players[0].name).toBe('Alice');
    expect(updatedGame.players[0].score).toBe(5);
    expect(updatedGame.players[1].score).toBe(0); // Bob unchanged
  });

  it('should add points to second player', () => {
    const updatedGame = updatePlayerScore(game, 'Bob', 3);

    expect(updatedGame.players[0].score).toBe(0); // Alice unchanged
    expect(updatedGame.players[1].name).toBe('Bob');
    expect(updatedGame.players[1].score).toBe(3);
  });

  it('should accumulate points across multiple updates', () => {
    let updatedGame = updatePlayerScore(game, 'Alice', 5);
    updatedGame = updatePlayerScore(updatedGame, 'Alice', 3);
    updatedGame = updatePlayerScore(updatedGame, 'Alice', 2);

    expect(updatedGame.players[0].score).toBe(10);
  });

  it('should handle adding points to different players', () => {
    let updatedGame = updatePlayerScore(game, 'Alice', 5);
    updatedGame = updatePlayerScore(updatedGame, 'Bob', 7);
    updatedGame = updatePlayerScore(updatedGame, 'Alice', 2);

    expect(updatedGame.players[0].score).toBe(7);  // Alice: 5 + 2
    expect(updatedGame.players[1].score).toBe(7);  // Bob: 7
  });

  it('should accept minimum score delta (1)', () => {
    const updatedGame = updatePlayerScore(game, 'Alice', 1);

    expect(updatedGame.players[0].score).toBe(1);
  });

  it('should accept maximum score delta (100)', () => {
    const updatedGame = updatePlayerScore(game, 'Alice', 100);

    expect(updatedGame.players[0].score).toBe(100);
  });

  it('should reject score delta of 0', () => {
    expect(() => updatePlayerScore(game, 'Alice', 0)).toThrow(ValidationError);
    expect(() => updatePlayerScore(game, 'Alice', 0)).toThrow(/Must be between 1 and 100/);
  });

  it('should reject negative score delta', () => {
    expect(() => updatePlayerScore(game, 'Alice', -5)).toThrow(ValidationError);
    expect(() => updatePlayerScore(game, 'Alice', -5)).toThrow(/Must be between 1 and 100/);
  });

  it('should reject score delta over 100', () => {
    expect(() => updatePlayerScore(game, 'Alice', 101)).toThrow(ValidationError);
    expect(() => updatePlayerScore(game, 'Alice', 101)).toThrow(/Must be between 1 and 100/);
  });

  it('should reject non-integer score delta', () => {
    expect(() => updatePlayerScore(game, 'Alice', 5.5)).toThrow(ValidationError);
    expect(() => updatePlayerScore(game, 'Alice', 5.5)).toThrow(/Must be an integer/);
  });

  it('should throw error for non-existent player', () => {
    expect(() => updatePlayerScore(game, 'Charlie', 5)).toThrow(ValidationError);
    expect(() => updatePlayerScore(game, 'Charlie', 5)).toThrow(/Player 'Charlie' not found/);
  });

  it('should throw error for empty player name', () => {
    expect(() => updatePlayerScore(game, '', 5)).toThrow(ValidationError);
  });

  it('should update lastUpdated timestamp', () => {
    const originalTime = game.lastUpdated;

    // Wait 1ms to ensure different timestamp
    const start = Date.now();
    while (Date.now() === start) {
      // Busy wait for 1ms
    }

    const updatedGame = updatePlayerScore(game, 'Alice', 5);

    expect(updatedGame.lastUpdated).not.toBe(originalTime);
    expect(updatedGame.lastUpdated >= originalTime).toBe(true);
  });

  it('should return a new GameSession (immutability)', () => {
    const updatedGame = updatePlayerScore(game, 'Alice', 5);

    expect(updatedGame).not.toBe(game);
    expect(game.players[0].score).toBe(0); // Original unchanged
    expect(updatedGame.players[0].score).toBe(5);
  });

  it('should not mutate original game players array', () => {
    const originalPlayers = game.players;
    const originalAliceScore = game.players[0].score;

    updatePlayerScore(game, 'Alice', 5);

    expect(game.players).toBe(originalPlayers);
    expect(game.players[0].score).toBe(originalAliceScore);
  });

  it('should handle large accumulated scores', () => {
    let updatedGame = game;
    for (let i = 0; i < 10; i++) {
      updatedGame = updatePlayerScore(updatedGame, 'Alice', 10);
    }

    expect(updatedGame.players[0].score).toBe(100);
  });

  it('should preserve other game properties', () => {
    const updatedGame = updatePlayerScore(game, 'Alice', 5);

    expect(updatedGame.gameId).toBe(game.gameId);
    expect(updatedGame.createdAt).toBe(game.createdAt);
    expect(updatedGame.players.length).toBe(game.players.length);
  });
});
