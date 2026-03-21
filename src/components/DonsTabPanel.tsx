"use client";

import { useMemo } from "react";
import { usePlayerLeaderboard } from "@/lib/hooks";
import { computePlayerRanks } from "@/lib/ranks";
import { SF_SCHOOL_ID } from "@/lib/constants";
import type { Course } from "@/lib/types";
import PlayerTableSection from "./PlayerTableSection";
import PlayerTabSkeleton from "./PlayerTabSkeleton";

export default function DonsTabPanel({
  tournamentId,
  courses,
}: {
  tournamentId: string;
  courses: Course[];
}) {
  const playerQuery = usePlayerLeaderboard(tournamentId);

  const players = playerQuery.data?.results ?? [];

  const { rankMap } = useMemo(
    () => computePlayerRanks(players),
    [players]
  );

  const sfPlayers = useMemo(
    () =>
      players
        .filter((p) => p.schoolId === SF_SCHOOL_ID)
        .sort((a, b) => {
          if (a.teamLabel === "IND" && b.teamLabel !== "IND") return 1;
          if (a.teamLabel !== "IND" && b.teamLabel === "IND") return -1;
          return a.totalScore - b.totalScore;
        }),
    [players]
  );

  if (playerQuery.isLoading) {
    return <PlayerTabSkeleton />;
  }

  return (
    <PlayerTableSection
      players={sfPlayers}
      courses={courses}
      playerRankMap={rankMap}
      showSchool
    />
  );
}
