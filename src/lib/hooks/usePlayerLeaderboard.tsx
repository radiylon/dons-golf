"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPlayerLeaderboard } from "../api";
import { POLL_INTERVAL_MS } from "../constants";

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