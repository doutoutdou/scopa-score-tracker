import { useState } from 'react';
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Scopa Score Tracker</h1>
        <p className="text-gray-600">Track scores for your game</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {players.map((player) => (
          <ScoreControl
            key={player.name}
            player={player}
            onAddPoints={(points) => handleAddPoints(player.name, points)}
            onRemovePoint={() => handleRemovePoint(player.name)}
          />
        ))}
      </div>

      <div className="text-center pt-6 border-t border-gray-200">
        <button
          onClick={handleNewGameClick}
          className="px-6 py-3 text-base font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
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
