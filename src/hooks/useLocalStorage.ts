import { useState, useEffect } from 'react';
import { GameSession } from '../core/types';
import {
  saveGameState,
  loadGameState,
  clearGameState,
} from '../storage/local-storage';

export function useLocalStorage() {
  const [gameState, setGameState] = useState<GameSession | null>(null);

  // Load game state on mount
  useEffect(() => {
    const loaded = loadGameState();
    setGameState(loaded);
  }, []);

  const saveGame = (game: GameSession | null) => {
    console.log('useLocalStorage.saveGame called:', game?.gameId, 'players:', game?.players.length);
    saveGameState(game);
    setGameState(game);
    console.log('useLocalStorage.saveGame completed');
  };

  const clearGame = () => {
    clearGameState();
    setGameState(null);
  };

  return {
    gameState,
    saveGame,
    clearGame,
  };
}
