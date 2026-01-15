import { useState } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { ScoreControl } from './ScoreControl';
import { ConfirmModal } from './ConfirmModal';

interface GamePlayProps {
  gameSession: ReturnType<typeof import('../hooks/useGameSession').useGameSession>;
}

export function GamePlay({ gameSession }: GamePlayProps) {
  const { players, addPoints, removePoint, startNewGame } = gameSession;
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleAddPoints = (playerName: string, points: number) => {
    addPoints(playerName, points);
  };

  const handleRemovePoint = (playerName: string) => {
    removePoint(playerName);
  };

  const handleNewGameClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmNewGame = () => {
    setShowConfirmModal(false);
    startNewGame();
  };

  const handleCancelNewGame = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Italian flag decoration */}
      <div className="text-center mb-8 relative">
        {/* Italian flag stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-gradient-to-r from-green-600 to-green-500"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-gradient-to-r from-red-500 to-red-600"></div>
        </div>

        <div className="pt-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
              Scopa Score Tracker
            </h1>
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-gray-700 font-medium">Live Game - Track your scores</p>
        </div>
      </div>

      {/* Score cards grid with felt table background */}
      <div className="bg-gradient-to-br from-green-800/10 to-emerald-800/10 rounded-3xl p-6 mb-8 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player, index) => (
            <div key={player.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <ScoreControl
                player={player}
                onAddPoints={(points) => handleAddPoints(player.name, points)}
                onRemovePoint={() => handleRemovePoint(player.name)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* New game button */}
      <div className="text-center pt-6 border-t-2 border-orange-200">
        <button
          onClick={handleNewGameClick}
          className="px-6 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 mx-auto hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
          New Game
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Start New Game?"
        message="Current scores will be reset and you'll return to player setup. This action cannot be undone."
        confirmText="Start New Game"
        cancelText="Cancel"
        onConfirm={handleConfirmNewGame}
        onCancel={handleCancelNewGame}
      />
    </div>
  );
}
