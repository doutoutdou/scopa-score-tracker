import { useState } from 'react';
import { Undo2 } from 'lucide-react';
import { Player } from '../core/types';
import { BroomIcon } from './icons/BroomIcon';
import { CardStackIcon } from './icons/CardStackIcon';
import { CoinIcon } from './icons/CoinIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { TrophyIcon } from './icons/TrophyIcon';

interface ScoreControlProps {
  player: Player;
  onAddPoints: (points: number) => void;
  onRemovePoint: () => void;
}

const scopaRules = [
  {
    name: 'Scopa',
    description: 'Cleared the table',
    points: 1,
    gradient: 'bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
    icon: BroomIcon
  },
  {
    name: 'Cards',
    description: 'Most cards (21+)',
    points: 1,
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    icon: CardStackIcon
  },
  {
    name: 'Coins',
    description: 'Most coins/diamonds',
    points: 1,
    gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
    icon: CoinIcon
  },
  {
    name: 'Settebello',
    description: '7 of coins',
    points: 1,
    gradient: 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    icon: SparkleIcon
  },
  {
    name: 'Primiera',
    description: 'Best prime',
    points: 1,
    gradient: 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
    icon: TrophyIcon
  },
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

  // Get player initials for avatar
  const initials = player.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 border-2 border-orange-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in">
      {/* Card suits decoration in corners */}
      <div className="absolute top-2 left-2 text-red-600/20 text-xl font-bold">♦</div>
      <div className="absolute top-2 right-2 text-red-600/20 text-xl font-bold">♥</div>

      {/* Player info with avatar */}
      <div className="mb-6 text-center relative">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-xl mb-3 shadow-md">
          {initials}
        </div>
        <div className="text-2xl font-display font-bold text-gray-800 mb-2">{player.name}</div>

        {/* Score display with medallion background */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md opacity-30"></div>
          <div className="relative text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-700 animate-score-pop">
            {player.score}
          </div>
        </div>
        <div className="text-sm text-gray-500 font-medium mt-1">points</div>
      </div>

      {/* Scoring rules buttons */}
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-3 text-center uppercase tracking-wide">Scoring Rules</div>
        <div className="space-y-2.5">
          {scopaRules.map(rule => {
            const Icon = rule.icon;
            return (
              <button
                key={rule.name}
                onClick={() => handleRuleClick(rule.points, rule.name)}
                className={`w-full px-4 py-3 text-white rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg flex items-center gap-3 ${rule.gradient}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm">{rule.name}</div>
                  <div className="text-xs opacity-90">{rule.description}</div>
                </div>
                <div className="text-lg font-bold">+{rule.points}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Undo button */}
      <div className="mt-4">
        <button
          onClick={handleRemovePoint}
          disabled={player.score === 0}
          className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
        >
          <Undo2 className="w-4 h-4" />
          Undo Last Point
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 text-xs text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded-lg animate-slide-up">
          {error}
        </div>
      )}
    </div>
  );
}
