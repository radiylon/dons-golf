"use client";

import { useMemo } from "react";
import { usePlayerLeaderboard } from "@/lib/hooks";
import { computePlayerRanks } from "@/lib/ranks";
import type { Course } from "@/lib/types";
import PlayerTableSection from "./PlayerTableSection";
import PlayerTabSkeleton from "./PlayerTabSkeleton";

export default function IndividualTabPanel({
  tournamentId,
  courses,
}: {
  tournamentId: string;
  courses: Course[];
}) {
  const playerQuery = usePlayerLeaderboard(tournamentId);

  const players = playerQuery.data?.results ?? [];

  const { rankMap, sorted } = useMemo(
    () => computePlayerRanks(players),
    [players]
  );

  if (playerQuery.isLoading) {
    return <PlayerTabSkeleton />;
  }

  return (
    <PlayerTableSection
      players={sorted}
      courses={courses}
      playerRankMap={rankMap}
      showSchool
      highlightSF
    />
  );
}
