import type { PlayerResult } from "./types";

/**
 * Returns the index of the latest active round — the in-progress round,
 * or the last round with strokes, falling back to 0.
 */
export function getLatestActiveRoundIndex(player: PlayerResult): number {
  // Prefer the in-progress round
  const liveIndex = player.rounds.findIndex(
    (r) => r.status === "in_progress"
  );
  if (liveIndex !== -1) return liveIndex;

  // Otherwise the last round that has actual strokes
  for (let i = player.rounds.length - 1; i >= 0; i--) {
    if (player.strokes[i] > 0) return i;
  }

  return 0;
}

/**
 * Find other players sharing the same tee time, starting hole, and course
 * as `target` for a given round — i.e. the playing group / foursome.
 */
export function findPlayingGroup(
  target: PlayerResult,
  allPlayers: PlayerResult[],
  roundIndex: number
): PlayerResult[] {
  const targetRound = target.rounds[roundIndex];
  if (!targetRound?.teeTime) return [];

  const { teeTime, startingHole, courseLabel } = targetRound;

  return allPlayers.filter((p) => {
    if (p.playerId === target.playerId) return false;
    const r = p.rounds[roundIndex];
    if (!r) return false;
    return (
      r.teeTime === teeTime &&
      r.startingHole === startingHole &&
      r.courseLabel === courseLabel
    );
  });
}
