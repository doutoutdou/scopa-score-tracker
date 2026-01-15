import { Player } from '../core/types';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-xl font-semibold text-gray-800 mb-2">{player.name}</div>
      <div className="text-3xl font-bold text-indigo-600">{player.score}</div>
    </div>
  );
}
