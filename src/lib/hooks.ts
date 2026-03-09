"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTournaments, fetchTeamLeaderboard, fetchPlayerLeaderboard } from "./api";
import { POLL_INTERVAL_MS } from "./constants";

export function useTournaments() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    staleTime: 5 * 60_000,
  });
}

export function useTeamLeaderboard(tournamentId: string) {
  return useQuery({
    queryKey: ["team-leaderboard", tournamentId],
    queryFn: () => fetchTeamLeaderboard(tournamentId),
    refetchInterval: (query) => {
      const isLive = query.state.data?.results?.some((t) =>
        t.rounds.some((r) => r.status === "in_progress")
      );
      return isLive ? POLL_INTERVAL_MS : false;
    },
  });
}

export function usePlayerLeaderboard(tournamentId: string) {
  return useQuery({
    queryKey: ["player-leaderboard", tournamentId],
    queryFn: () => fetchPlayerLeaderboard(tournamentId),
    refetchInterval: (query) => {
      const isLive = query.state.data?.results?.some((p) =>
        p.rounds.some((r) => r.status === "in_progress")
      );
      return isLive ? POLL_INTERVAL_MS : false;
    },
  });
}
