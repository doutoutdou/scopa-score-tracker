import { useLocalStorage } from './useLocalStorage';
import {
  createNewGame,
  addPlayer,
  getPlayers,
  validateGameSession,
} from '../core/game-session';
import { updatePlayerScore, removePlayerPoint } from '../core/scoring';
import { Player, ValidationError } from '../core/types';

export function useGameSession() {
  const { gameState: game, saveGame } = useLocalStorage();

  const startNewGame = () => {
    const newGame = createNewGame();
    saveGame(newGame);
  };

  const addPlayerToGame = (name: string) => {
    if (!game) {
      throw new ValidationError('No game session active');
    }

    const updatedGame = addPlayer(game, name);
    saveGame(updatedGame);
  };

  const addPoints = (playerName: string, points: number) => {
    if (!game) {
      throw new ValidationError('No game session active');
    }

    const updatedGame = updatePlayerScore(game, playerName, points);
    saveGame(updatedGame);
  };

  const removePoint = (playerName: string) => {
    if (!game) {
      throw new ValidationError('No game session active');
    }

    const updatedGame = removePlayerPoint(game, playerName);
    saveGame(updatedGame);
  };

  const isGameValid = (): boolean => {
    if (!game) {
      return false;
    }

    try {
      validateGameSession(game);
      return true;
    } catch {
      return false;
    }
  };

  const players: readonly Player[] = game ? getPlayers(game) : [];

  return {
    game,
    players,
    startNewGame,
    addPlayerToGame,
    addPoints,
    removePoint,
    isGameValid,
  };
}
