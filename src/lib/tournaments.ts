import { SF_SCHOOL_ID, RORO_PLAYER_NAME, RORO_ENROLLMENT_YEAR } from "./constants";
import { getTournamentStatus } from "./format";
import type { Tournament, PlayerResult } from "./types";

const CLASS_YEARS = ["Freshman", "Sophomore", "Junior", "Senior"] as const;

export function getActiveTournament(
  tournaments: Tournament[]
): { id: string; isLive: boolean } | null {
  const withResults = tournaments.filter((t) => t.hasResults);

  const live = withResults.find((t) => getTournamentStatus(t) === "live");
  if (live) return { id: live.tournamentId, isLive: true };

  const completed = withResults
    .filter((t) => getTournamentStatus(t) === "completed")
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
  if (completed.length > 0)
    return { id: completed[0].tournamentId, isLive: false };

  return null;
}

export function findRoro(players: PlayerResult[]): PlayerResult | null {
  const exact = players.find(
    (p) => p.playerName === RORO_PLAYER_NAME && p.schoolId === SF_SCHOOL_ID
  );
  if (exact) return exact;

  const fallback = players.find(
    (p) =>
      p.playerName?.toLowerCase().includes("rodaylin") &&
      p.schoolId === SF_SCHOOL_ID
  );
  return fallback ?? null;
}

export function getClassYear(): string {
  const now = new Date();
  const academicYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const yearsIn = academicYear - RORO_ENROLLMENT_YEAR;
  return CLASS_YEARS[Math.min(Math.max(yearsIn, 0), 3)];
}
