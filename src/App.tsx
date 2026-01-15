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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden">
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='30' font-size='24' fill='%23DC2626'%3E♠%3C/text%3E%3Ctext x='35' y='30' font-size='24' fill='%23DC2626'%3E♥%3C/text%3E%3Ctext x='5' y='55' font-size='24' fill='%23DC2626'%3E♣%3C/text%3E%3Ctext x='35' y='55' font-size='24' fill='%23DC2626'%3E♦%3C/text%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen relative z-10">
        {isPlaying ? (
          <GamePlay gameSession={gameSession} />
        ) : (
          <GameSetup gameSession={gameSession} onStartPlaying={handleStartPlaying} />
        )}
      </div>
    </div>
  );
}

export default App;
