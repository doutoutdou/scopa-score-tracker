import { useState, useEffect } from 'react';
import { GameSetup } from './components/GameSetup';
import { GamePlay } from './components/GamePlay';
import { useGameSession } from './hooks/useGameSession';
import './App.css';

function App() {
  const gameSession = useGameSession();
  const { game, players } = gameSession;
  const [isPlaying, setIsPlaying] = useState(false);

  console.log('App render:', {
    isPlaying,
    hasGame: !!game,
    gameId: game?.gameId,
    playersCount: players.length,
    playerNames: players.map(p => p.name),
    localStorage: localStorage.getItem('scopa-game-state')
  });

  // Reset to setup mode when starting a new game or when game becomes invalid
  useEffect(() => {
    console.log('App useEffect:', { hasGame: !!game, playersCount: players.length });
    // If no game or not enough players (need 2-4), go back to setup
    if (!game || players.length < 2) {
      console.log('Setting isPlaying to false');
      setIsPlaying(false);
    }
  }, [game, players.length]);

  const handleStartPlaying = () => {
    console.log('handleStartPlaying called');
    console.log('Current players:', players.length);

    // Only allow starting if we have 2-4 players
    if (game && players.length >= 2 && players.length <= 4) {
      console.log('Setting isPlaying to true');
      setIsPlaying(true);
    } else {
      console.warn('Cannot start game - invalid conditions');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      {isPlaying ? (
        <GamePlay gameSession={gameSession} />
      ) : (
        <GameSetup gameSession={gameSession} onStartPlaying={handleStartPlaying} />
      )}
    </div>
  );
}

export default App;
