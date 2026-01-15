import { Users } from 'lucide-react';
import { Player } from '../core/types';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: readonly Player[];
}

export function PlayerList({ players }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="p-10 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl my-8 text-center">
        <Users className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium m-0">No players yet. Add players to start the game.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      {players.map((player, index) => (
        <div
          key={`${player.name}-${index}`}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PlayerCard player={player} />
        </div>
      ))}
    </div>
  );
}
