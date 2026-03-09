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
