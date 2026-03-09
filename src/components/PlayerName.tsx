import type { PlayerResult } from "@/lib/types";

export default function PlayerName({ player }: { player: PlayerResult }) {
  const isPlaying = player.rounds.some((r) => r.status === "in_progress" || r.status === "played");
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-sm truncate">{player.playerName}</span>
        {player.teamLabel === "IND" && (
          <span className="text-[9px] text-gray-400">IND</span>
        )}
        {isPlaying && (
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
        )}
      </div>
    </div>
  );
}
