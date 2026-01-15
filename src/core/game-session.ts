// src/core/game-session.ts

import { GameSession, Player, ValidationError, MIN_PLAYERS, MAX_PLAYERS } from './types';
import { validatePlayerName } from './validation';

export function createNewGame(): GameSession {
  const now = new Date().toISOString();
  return {
    gameId: crypto.randomUUID(),
    players: [],
    createdAt: now,
    lastUpdated: now,
  };
}

export function addPlayer(game: GameSession, name: string): GameSession {
  // Validate player name
  validatePlayerName(name);

  // Check for duplicate names
  if (game.players.some(p => p.name === name)) {
    throw new ValidationError(`Player '${name}' already exists in game`);
  }

  // Check maximum players
  if (game.players.length >= MAX_PLAYERS) {
    throw new ValidationError(
      `Cannot add player: game already has ${MAX_PLAYERS} players (maximum)`
    );
  }

  // Create new player with score 0 (FR-004)
  const newPlayer: Player = {
    name,
    score: 0,
  };

  // Return new game session with added player (immutable)
  return {
    ...game,
    players: [...game.players, newPlayer],
    lastUpdated: new Date().toISOString(),
  };
}

export function getPlayers(game: GameSession): readonly Player[] {
  return game.players;
}

export function validateGameSession(game: GameSession): void {
  // Check minimum players (FR-009)
  if (game.players.length < MIN_PLAYERS) {
    throw new ValidationError(
      `Game requires at least ${MIN_PLAYERS} players, got ${game.players.length}`
    );
  }

  // Check maximum players (FR-009)
  if (game.players.length > MAX_PLAYERS) {
    throw new ValidationError(
      `Game supports maximum ${MAX_PLAYERS} players, got ${game.players.length}`
    );
  }

  // Check for duplicate names
  const names = game.players.map(p => p.name);
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    const duplicates = names.filter((name, index) =>
      names.indexOf(name) !== index
    );
    throw new ValidationError(
      `Duplicate player names: ${duplicates.join(', ')}`
    );
  }
}
