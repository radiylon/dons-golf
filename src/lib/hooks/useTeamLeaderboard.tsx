"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeamLeaderboard } from "../api";
import { POLL_INTERVAL_MS } from "../constants";

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
