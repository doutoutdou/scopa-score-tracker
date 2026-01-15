import { Player } from '../core/types';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: readonly Player[];
}

export function PlayerList({ players }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg my-8">
        <p className="text-gray-600 m-0">No players yet. Add players to start the game.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      {players.map((player, index) => (
        <PlayerCard key={`${player.name}-${index}`} player={player} />
      ))}
    </div>
  );
}
