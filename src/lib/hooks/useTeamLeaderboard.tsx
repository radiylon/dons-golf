"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeamLeaderboard } from "../api";
import { POLL_INTERVAL_MS } from "../constants";

export function useTeamLeaderboard(tournamentId: string) {
  return useQuery({
    queryKey: ["team-leaderboard", tournamentId],
    queryFn: () => fetchTeamLeaderboard(tournamentId),
    select: (data) => ({
      ...data,
      results: [...data.results].sort((a, b) => {
        if (a.totalStrokes === 0 && b.totalStrokes === 0) return 0;
        if (a.totalStrokes === 0) return 1;
        if (b.totalStrokes === 0) return -1;
        return a.totalScore - b.totalScore;
      }),
    }),
    refetchInterval: (query) => {
      const isLive = query.state.data?.results?.some((t) =>
        t.rounds.some((r) => r.status === "in_progress")
      );
      return isLive ? POLL_INTERVAL_MS : false;
    },
  });
}
