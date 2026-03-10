"use client";

import { useTournaments, useTeamLeaderboard, usePlayerLeaderboard } from "@/lib/hooks";
import { SF_SCHOOL_ID, TOURNAMENT_NAME_OVERRIDES } from "@/lib/constants";
import { formatScore, scoreColor, ordinal } from "@/lib/format";
import type { PlayerResult, TeamResult, Course } from "@/lib/types";
import TeamStandings from "./TeamStandings";
import PlayerTableSection from "./PlayerTableSection";
import LastUpdated from "./LastUpdated";
import PageHeader from "./PageHeader";
import Link from "next/link";
import { useState, useMemo } from "react";

const EMPTY_TEAMS: TeamResult[] = [];
const EMPTY_PLAYERS: PlayerResult[] = [];
const EMPTY_COURSES: Course[] = [];

export default function Scoreboard({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [activeTab, setActiveTab] = useState<"team" | "individual" | "players">("team");

  const tournamentsQuery = useTournaments();

  const tournamentMeta = tournamentsQuery.data?.results.find(
    (t) => t.tournamentId === tournamentId
  );
  const startDate = tournamentMeta?.startDate;

  const teamQuery = useTeamLeaderboard(tournamentId);
  const playerQuery = usePlayerLeaderboard(tournamentId);

  const isLoading = teamQuery.isLoading || playerQuery.isLoading;
  const isError = teamQuery.isError || playerQuery.isError;
  const isFetching = teamQuery.isFetching || playerQuery.isFetching;
  const lastUpdated = Math.max(
    teamQuery.dataUpdatedAt || 0,
    playerQuery.dataUpdatedAt || 0
  );

  const tournamentName = TOURNAMENT_NAME_OVERRIDES[tournamentId] ?? tournamentMeta?.tournamentName ?? "Tournament";

  const teams = teamQuery.data?.results ?? EMPTY_TEAMS;
  const players = playerQuery.data?.results ?? EMPTY_PLAYERS;
  const courses = teamQuery.data?.courses ?? EMPTY_COURSES;

  const sortedTeams = useMemo(() =>
    [...teams].sort((a, b) => {
      if (a.totalStrokes === 0 && b.totalStrokes === 0) return 0;
      if (a.totalStrokes === 0) return 1;
      if (b.totalStrokes === 0) return -1;
      return a.totalScore - b.totalScore;
    }), [teams]);

  const sfTeam = useMemo(() => teams.find((t) => t.schoolId === SF_SCHOOL_ID), [teams]);

  const sfPlayers = useMemo(() =>
    players
      .filter((p) => p.schoolId === SF_SCHOOL_ID)
      .sort((a, b) => {
        if (a.teamLabel === "IND" && b.teamLabel !== "IND") return 1;
        if (a.teamLabel !== "IND" && b.teamLabel === "IND") return -1;
        return a.totalScore - b.totalScore;
      }), [players]);

  const sfRankInfo = useMemo(() => {
    const idx = sortedTeams.findIndex((t) => t.schoolId === SF_SCHOOL_ID);
    if (idx === -1) return { rank: 0, isTied: false, total: sortedTeams.length };
    const rank = idx + 1;
    const score = sortedTeams[idx].totalScore;
    const isTied = sortedTeams.some((t, i) => i !== idx && t.totalStrokes > 0 && t.totalScore === score);
    return { rank, isTied, total: sortedTeams.length };
  }, [sortedTeams]);

  const { rankMap: playerRankMap, sorted: sortedAllPlayers } = useMemo(
    () => computePlayerRanks(players),
    [players]
  );

  const header = <PageHeader title={tournamentName} />;

  if (isLoading) {
    return (
      <>
        {header}
        <div className="max-w-lg mx-auto px-4 pt-4 space-y-4 animate-pulse">
          {/* SF Banner skeleton */}
          <div className="bg-usf-green/20 rounded-xl p-4 h-32" />
          {/* Tab bar skeleton */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <div className="flex-1 h-9 bg-gray-200 rounded-md" />
            <div className="flex-1 h-9 bg-gray-200 rounded-md" />
            <div className="flex-1 h-9 bg-gray-200 rounded-md" />
          </div>
          {/* Table skeleton */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3 border-b border-gray-50">
                <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-28" />
                  <div className="h-3 bg-gray-100 rounded w-16" />
                </div>
                <div className="h-4 w-10 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        {header}
        <div className="max-w-lg mx-auto px-4 my-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Failed to load scores. Pull down to retry.
          </div>
        </div>
      </>
    );
  }

  const hasData = teams.length > 0;

  if (!hasData) {
    return (
      <>
        {header}
        <div className="max-w-lg mx-auto px-4 my-8 p-6 bg-white border border-gray-200 rounded-xl text-center">
          <p className="text-gray-500 text-sm">
            No scores available yet for this tournament.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Check back when play begins
            {startDate ? ` on ${new Date(startDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : ""}
            .
          </p>
        </div>
      </>
    );
  }

  const numRounds = courses.length;

  const isLive = sfTeam?.rounds.some((r) => r.status === "in_progress");

  const rawCourseName = courses[0]?.courseName || "Unknown Course";
  const courseName = rawCourseName.replace(/\bTpc\b/g, "TPC");
  const totalPar = courses[0]?.totalPar || 72;
  const totalYards = courses[0]?.totalYards || 0;

  return (
    <>
      <PageHeader
        title={tournamentName}
        subtitle={<><span className="font-bold text-white">{courseName}</span>{" · "}Par {totalPar} · {totalYards.toLocaleString()} yards</>}
      />

      <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-center">
        <LastUpdated timestamp={lastUpdated} isFetching={isFetching} />
      </div>

      <div className="max-w-lg mx-auto pt-2">
        {/* SF Summary Banner */}
        <div className="mx-4 mb-4 bg-usf-green rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-usf-gold text-xs font-medium uppercase tracking-wider">
                San Francisco Dons
              </p>
              <p className="text-3xl font-bold tabular-nums mt-0.5">
                {sfTeam && sfTeam.totalStrokes > 0
                  ? formatScore(sfTeam.totalScore)
                  : "–"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white text-xs uppercase font-medium tracking-wider">Team Position</p>
              {sfTeam && sfTeam.totalStrokes > 0 && sfRankInfo.rank > 0 ? (
                <p className="text-3xl font-bold tabular-nums mt-0.5">
                  {sfRankInfo.isTied ? "T" : ""}
                  {ordinal(sfRankInfo.rank)}
                  <span className="font-normal text-white/50">
                    {" "}of {sfRankInfo.total}
                  </span>
                </p>
              ) : (
                <p className="text-3xl font-bold tabular-nums">–</p>
              )}
            </div>
          </div>
          {sfTeam && sfTeam.totalStrokes > 0 && (
            <div className="mt-3 flex gap-3 text-sm">
              {sfTeam.strokes.map((strokes, i) => (
                <div
                  key={i}
                  className="bg-white/10 rounded-lg px-3 py-1.5 text-center"
                >
                  <p className="text-white/50 text-xs">R{i + 1}</p>
                  <p className="font-semibold tabular-nums">{strokes > 0 ? strokes : "–"}</p>
                </div>
              ))}
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
                <p className="text-white/50 text-xs">Total</p>
                <p className="font-semibold tabular-nums">
                  {sfTeam.totalStrokes}
                </p>
              </div>
            </div>
          )}
          {isLive && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="relative mx-4 mb-4 flex gap-1 bg-gray-100 rounded-lg p-1">
          <div
            className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-[left] duration-75"
            style={{
              width: "calc((100% - 16px) / 3)",
              left: activeTab === "team"
                ? "4px"
                : activeTab === "individual"
                  ? "calc(4px + (100% - 8px) / 3)"
                  : "calc(4px + 2 * (100% - 8px) / 3)",
            }}
          />
          <button
            onClick={() => setActiveTab("team")}
            className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-md cursor-pointer ${
              activeTab === "team" ? "text-usf-green" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Team
          </button>
          <button
            onClick={() => setActiveTab("individual")}
            className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-md cursor-pointer ${
              activeTab === "individual" ? "text-usf-green" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-md cursor-pointer ${
              activeTab === "players" ? "text-usf-green" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Dons
          </button>
        </div>

        {activeTab === "team" && (
          <TeamStandings teams={sortedTeams} numRounds={numRounds} />
        )}

        {activeTab === "individual" && (
          <PlayerTableSection
            players={sortedAllPlayers}
            courses={courses}
            playerRankMap={playerRankMap}
            showSchool
          />
        )}

        {activeTab === "players" && (
          <PlayerTableSection
            players={sfPlayers}
            courses={courses}
            playerRankMap={playerRankMap}
            showSchool
          />
        )}
      </div>
    </>
  );
}

function computePlayerRanks(players: PlayerResult[]): {
  rankMap: Map<string, { rank: number; isTied: boolean }>;
  sorted: PlayerResult[];
} {
  // Single sort pass — scored players first by score, unscored at the end.
  const sorted = [...players].sort((a, b) => {
    if (a.totalStrokes === 0 && b.totalStrokes === 0) return 0;
    if (a.totalStrokes === 0) return 1;
    if (b.totalStrokes === 0) return -1;
    return a.totalScore - b.totalScore;
  });

  const rankMap = new Map<string, { rank: number; isTied: boolean }>();
  for (let i = 0; i < sorted.length; i++) {
    const player = sorted[i];
    if (player.totalStrokes === 0) break;
    const isTied =
      (i > 0 && sorted[i - 1].totalScore === player.totalScore) ||
      (i < sorted.length - 1 && sorted[i + 1]?.totalStrokes > 0 && sorted[i + 1].totalScore === player.totalScore);
    rankMap.set(player.playerId, { rank: i + 1, isTied });
  }
  return { rankMap, sorted };
}
