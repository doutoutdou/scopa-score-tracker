import { useState } from 'react';
import { Player } from '../core/types';

interface ScoreControlProps {
  player: Player;
  onAddPoints: (points: number) => void;
  onRemovePoint: () => void;
}

const scopaRules = [
  { name: 'Scopa', description: 'Cleared the table', points: 1, color: 'bg-purple-600 hover:bg-purple-700' },
  { name: 'Cards', description: 'Most cards (21+)', points: 1, color: 'bg-blue-600 hover:bg-blue-700' },
  { name: 'Coins', description: 'Most coins/diamonds', points: 1, color: 'bg-yellow-600 hover:bg-yellow-700' },
  { name: 'Settebello', description: '7 of coins', points: 1, color: 'bg-green-600 hover:bg-green-700' },
  { name: 'Primiera', description: 'Best prime', points: 1, color: 'bg-red-600 hover:bg-red-700' },
];

export function ScoreControl({ player, onAddPoints, onRemovePoint }: ScoreControlProps) {
  const [error, setError] = useState<string | null>(null);

  const handleRuleClick = (points: number, ruleName: string) => {
    setError(null);
    try {
      onAddPoints(points);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to add ${ruleName} point`);
    }
  };

  const handleRemovePoint = () => {
    setError(null);
    try {
      onRemovePoint();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove point');
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4 text-center">
        <div className="text-xl font-semibold text-gray-800 mb-1">{player.name}</div>
        <div className="text-5xl font-bold text-indigo-600">{player.score}</div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-600 mb-3 text-center">Scopa Rules:</div>
        <div className="space-y-2">
          {scopaRules.map(rule => (
            <button
              key={rule.name}
              onClick={() => handleRuleClick(rule.points, rule.name)}
              className={`w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors duration-200 ${rule.color}`}
            >
              <div className="font-semibold">{rule.name}</div>
              <div className="text-xs opacity-90 mt-0.5">{rule.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleRemovePoint}
          disabled={player.score === 0}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          ↩ Undo Last Point
        </button>
      </div>

      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
