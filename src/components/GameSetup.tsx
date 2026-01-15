import { useState, FormEvent } from 'react';
import { PlayerList } from './PlayerList';

interface GameSetupProps {
  gameSession: ReturnType<typeof import('../hooks/useGameSession').useGameSession>;
  onStartPlaying?: () => void;
}

export function GameSetup({ gameSession, onStartPlaying }: GameSetupProps) {
  const { game, players, startNewGame, addPlayerToGame, isGameValid } = gameSession;
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('GameSetup render:', {
    hasGame: !!game,
    gameId: game?.gameId,
    playersCount: players.length,
    playerNames: players.map(p => p.name)
  });

  const handleStartNewGame = () => {
    try {
      console.log('Starting new game...');
      startNewGame();
      setError(null);
      console.log('New game started successfully');
    } catch (err) {
      console.error('Error starting new game:', err);
      setError(err instanceof Error ? err.message : 'Failed to start new game');
    }
  };

  const handleAddPlayer = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!playerName.trim()) {
      setError('Player name cannot be empty');
      return;
    }

    try {
      addPlayerToGame(playerName.trim());
      setPlayerName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add player');
    }
  };

  const canStartGame = isGameValid();
  const canAddMorePlayers = game && players.length < 4;

  const handleStartGame = () => {
    console.log('Start Game button clicked');
    console.log('canStartGame:', canStartGame);
    console.log('onStartPlaying callback:', onStartPlaying);
    if (onStartPlaying) {
      onStartPlaying();
    } else {
      console.error('onStartPlaying callback is undefined!');
    }
  };

  if (!game) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Scopa Score Tracker</h1>
        <p className="mb-6 text-gray-600">Welcome! Start a new game to begin tracking scores.</p>
        <button
          onClick={handleStartNewGame}
          className="px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Start New Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Scopa Score Tracker</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Setup Players</h2>
        <p className="text-gray-600">Add 2-4 players to start the game</p>
      </div>

      <PlayerList players={players} />

      {canAddMorePlayers && (
        <form onSubmit={handleAddPlayer} className="flex flex-col sm:flex-row gap-2 justify-center my-8">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="px-3 py-3 text-base border-2 border-gray-200 rounded-lg w-full sm:w-80 transition-colors duration-300 focus:outline-none focus:border-indigo-600"
            maxLength={30}
          />
          <button
            type="submit"
            className="px-6 py-3 text-base font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            Add Player
          </button>
        </form>
      )}

      {error && (
        <div className="text-red-700 bg-red-50 px-3 py-3 rounded-lg my-4 text-sm">
          {error}
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-gray-200">
        {canStartGame ? (
          <div className="space-y-4">
            <p className="text-green-600 font-medium mb-4">
              Ready to play! You have {players.length} players.
            </p>
            <button
              onClick={handleStartGame}
              className="px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Start Game
            </button>
            <div className="mt-4">
              <button
                onClick={handleStartNewGame}
                className="px-6 py-3 text-base font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                Reset Game
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-sm mb-4">
              Add {2 - players.length} more player{2 - players.length === 1 ? '' : 's'} to start
            </p>
            <button
              onClick={handleStartNewGame}
              className="px-6 py-3 text-base font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
            >
              Reset Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
