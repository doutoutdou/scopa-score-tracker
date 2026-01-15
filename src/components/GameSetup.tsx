import { useState, FormEvent } from 'react';
import { Play, UserPlus, RefreshCw, Sparkles } from 'lucide-react';
import { PlayerList } from './PlayerList';
import { PlayCardIcon } from './icons/PlayCardIcon';

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
      <div className="text-center animate-scale-in">
        {/* Decorative cards */}
        <div className="flex justify-center gap-4 mb-6">
          <PlayCardIcon className="w-16 h-16 text-red-600 animate-float" style={{ animationDelay: '0s' }} />
          <PlayCardIcon className="w-20 h-20 text-orange-600 animate-float" style={{ animationDelay: '0.2s' }} />
          <PlayCardIcon className="w-16 h-16 text-yellow-600 animate-float" style={{ animationDelay: '0.4s' }} />
        </div>

        <h1 className="text-5xl font-display font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
          Scopa Score Tracker
        </h1>
        <p className="mb-8 text-lg text-gray-700 max-w-md mx-auto">
          Welcome! Track your Scopa game scores with style. Ready to play?
        </p>
        <button
          onClick={handleStartNewGame}
          className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
        >
          <Play className="w-6 h-6" />
          Start New Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-5xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
        Scopa Score Tracker
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center justify-center gap-2">
          <UserPlus className="w-6 h-6 text-indigo-600" />
          Setup Players
        </h2>
        <p className="text-gray-600">Add 2-4 players to start the game</p>
      </div>

      <PlayerList players={players} />

      {canAddMorePlayers && (
        <form onSubmit={handleAddPlayer} className="flex flex-col sm:flex-row gap-3 justify-center my-8 max-w-md mx-auto">
          <div className="relative flex-1">
            <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="w-full pl-11 pr-4 py-3 text-base border-2 border-orange-200 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
              maxLength={30}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Player
          </button>
        </form>
      )}

      {error && (
        <div className="text-red-700 bg-red-100 border border-red-300 px-4 py-3 rounded-xl my-4 text-sm max-w-md mx-auto animate-slide-up">
          {error}
        </div>
      )}

      <div className="mt-8 pt-8 border-t-2 border-orange-200">
        {canStartGame ? (
          <div className="space-y-4 animate-scale-in">
            <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-4 bg-green-100 py-3 px-6 rounded-2xl mx-auto max-w-sm border-2 border-green-300">
              <Sparkles className="w-5 h-5" />
              Ready to play! {players.length} players joined
              <Sparkles className="w-5 h-5" />
            </div>
            <button
              onClick={handleStartGame}
              className="px-10 py-4 text-xl font-bold text-white bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
            >
              <Play className="w-7 h-7" />
              Start Game
            </button>
            <div className="mt-6">
              <button
                onClick={handleStartNewGame}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Game
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-4 bg-gray-100 py-3 px-6 rounded-xl mx-auto max-w-sm">
              Add {2 - players.length} more player{2 - players.length === 1 ? '' : 's'} to start
            </p>
            <button
              onClick={handleStartNewGame}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
