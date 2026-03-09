import { CLIPPD_API } from "./constants";
import type { TeamLeaderboard, PlayerLeaderboard, TournamentList } from "./types";

export async function fetchTournaments(): Promise<TournamentList> {
  const res = await fetch("/api/tournaments");
  if (!res.ok) throw new Error("Failed to fetch tournaments");
  return res.json();
}

export async function fetchTeamLeaderboard(tournamentId: string): Promise<TeamLeaderboard> {
  const res = await fetch(`/api/team?tournamentId=${tournamentId}`);
  if (!res.ok) throw new Error("Failed to fetch team leaderboard");
  return res.json();
}

export async function fetchPlayerLeaderboard(tournamentId: string): Promise<PlayerLeaderboard> {
  const res = await fetch(`/api/players?tournamentId=${tournamentId}`);
  if (!res.ok) throw new Error("Failed to fetch player leaderboard");
  return res.json();
}

/** Server-side fetchers — call Clippd directly, skip the /api proxy */

export async function fetchTeamLeaderboardServer(tournamentId: string): Promise<TeamLeaderboard> {
  const res = await fetch(
    `${CLIPPD_API}/tournaments/${tournamentId}/leaderboards/team`,
    {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 30 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch team leaderboard");
  return res.json();
}

export async function fetchPlayerLeaderboardServer(tournamentId: string): Promise<PlayerLeaderboard> {
  const res = await fetch(
    `${CLIPPD_API}/tournaments/${tournamentId}/leaderboards/player`,
    {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 30 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch player leaderboard");
  return res.json();
}
