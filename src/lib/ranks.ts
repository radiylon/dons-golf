import type { PlayerResult } from "./types";

export function computePlayerRanks(players: PlayerResult[]): {
  rankMap: Map<string, { rank: number; isTied: boolean }>;
  sorted: PlayerResult[];
} {
  // Single sort pass — scored players first by score, unscored at the end.
  const sorted = [...players].sort((a, b) => {
    if (a.totalStrokes === 0 && b.totalStrokes === 0) return 0;
    if (a.totalStrokes === 0) return 1;
    if (b.totalStrokes === 0) return -1;
    return a.totalScore - b.totalScore;
  });

  const rankMap = new Map<string, { rank: number; isTied: boolean }>();
  for (let i = 0; i < sorted.length; i++) {
    const player = sorted[i];
    if (player.totalStrokes === 0) break;
    const isTied =
      (i > 0 && sorted[i - 1].totalScore === player.totalScore) ||
      (i < sorted.length - 1 && sorted[i + 1]?.totalStrokes > 0 && sorted[i + 1].totalScore === player.totalScore);
    rankMap.set(player.playerId, { rank: i + 1, isTied });
  }
  return { rankMap, sorted };
}
