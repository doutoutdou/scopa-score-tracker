import { GameSession, Player, ValidationError } from './types';
import { validatePlayerName, validateScoreDelta } from './validation';

export function updatePlayerScore(
  game: GameSession,
  playerName: string,
  scoreDelta: number
): GameSession {
  // Validate inputs
  validatePlayerName(playerName);
  validateScoreDelta(scoreDelta);

  // Find player
  const playerIndex = game.players.findIndex(p => p.name === playerName);
  if (playerIndex === -1) {
    throw new ValidationError(`Player '${playerName}' not found in game`);
  }

  // Calculate new score
  const currentPlayer = game.players[playerIndex];
  const newScore = currentPlayer.score + scoreDelta;

  // Create updated player
  const updatedPlayer: Player = {
    ...currentPlayer,
    score: newScore,
  };

  // Create new players array with updated player
  const updatedPlayers = [
    ...game.players.slice(0, playerIndex),
    updatedPlayer,
    ...game.players.slice(playerIndex + 1),
  ];

  // Return new game session
  return {
    ...game,
    players: updatedPlayers,
    lastUpdated: new Date().toISOString(),
  };
}

export function removePlayerPoint(
  game: GameSession,
  playerName: string
): GameSession {
  // Validate player name
  validatePlayerName(playerName);

  // Find player
  const playerIndex = game.players.findIndex(p => p.name === playerName);
  if (playerIndex === -1) {
    throw new ValidationError(`Player '${playerName}' not found in game`);
  }

  const currentPlayer = game.players[playerIndex];

  // Prevent negative scores
  if (currentPlayer.score === 0) {
    throw new ValidationError('Cannot remove point: score is already 0');
  }

  // Create updated player with score decreased by 1
  const updatedPlayer: Player = {
    ...currentPlayer,
    score: currentPlayer.score - 1,
  };

  // Create new players array with updated player
  const updatedPlayers = [
    ...game.players.slice(0, playerIndex),
    updatedPlayer,
    ...game.players.slice(playerIndex + 1),
  ];

  // Return new game session
  return {
    ...game,
    players: updatedPlayers,
    lastUpdated: new Date().toISOString(),
  };
}
