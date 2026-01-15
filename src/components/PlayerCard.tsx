import { Player } from '../core/types';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  // Get player initials for avatar
  const initials = player.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Card suit symbols for decoration
  const suits = ['♠', '♣', '♥', '♦'];
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];

  return (
    <div className="relative bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-200 rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:rotate-1">
      {/* Card suit decoration in corners */}
      <div className="absolute top-2 left-2 text-red-600/20 text-lg font-bold">{randomSuit}</div>
      <div className="absolute bottom-2 right-2 text-red-600/20 text-lg font-bold">{randomSuit}</div>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
          {initials}
        </div>

        {/* Player info */}
        <div className="flex-1">
          <div className="text-lg font-bold text-gray-800 mb-1">{player.name}</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-700">
              {player.score}
            </div>
            <div className="text-sm text-gray-500 font-medium">pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
