"use client";

import { useTournaments, useTeamLeaderboard, usePlayerLeaderboard } from "@/lib/hooks";
import { SF_SCHOOL_ID, TOURNAMENT_NAME_OVERRIDES } from "@/lib/constants";
import { formatScore, scoreColor } from "@/lib/format";
import type { PlayerResult } from "@/lib/types";
import TeamStandings from "./TeamStandings";
import DonsPlayers from "./DonsPlayers";
import LastUpdated from "./LastUpdated";
import PageHeader from "./PageHeader";
import Link from "next/link";
import { useState } from "react";

export default function Scoreboard({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [activeTab, setActiveTab] = useState<"team" | "players">("team");

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

  const header = <PageHeader title={tournamentName} />;

  if (isLoading) {
    return (
      <>
        {header}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-usf-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading scores...</p>
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

  const teams = teamQuery.data?.results ?? [];
  const players = playerQuery.data?.results ?? [];
  const courses = teamQuery.data?.courses ?? [];

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

  const sortedTeams = [...teams].sort((a, b) => {
    if (a.totalStrokes === 0 && b.totalStrokes === 0) return 0;
    if (a.totalStrokes === 0) return 1;
    if (b.totalStrokes === 0) return -1;
    return a.totalScore - b.totalScore;
  });

  const sfTeam = teams.find((t) => t.schoolId === SF_SCHOOL_ID);
  const sfPlayers = players
    .filter((p) => p.schoolId === SF_SCHOOL_ID)
    .sort((a, b) => {
      if (a.teamLabel === "IND" && b.teamLabel !== "IND") return 1;
      if (a.teamLabel !== "IND" && b.teamLabel === "IND") return -1;
      return a.totalScore - b.totalScore;
    });

  const sfRank =
    sortedTeams.findIndex((t) => t.schoolId === SF_SCHOOL_ID) + 1;
  const numRounds = courses.length;

  const isLive = sfTeam?.rounds.some((r) => r.status === "in_progress");

  const rawCourseName = courses[0]?.courseName || "Unknown Course";
  const courseName = rawCourseName.replace(/\bTpc\b/g, "TPC");
  const totalPar = courses[0]?.totalPar || 72;
  const totalYards = courses[0]?.totalYards || 0;

  const playerRankMap = computePlayerRanks(players);

  return (
    <>
      <PageHeader
        title={tournamentName}
        subtitle={<><span className="font-bold text-white">{courseName}</span>{" · "}Par {totalPar} · {totalYards.toLocaleString()} yards · {numRounds} rounds</>}
      />

      <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-gray-400 text-xs hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All Tournaments
        </Link>
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
            <p className="text-white text-xs uppercase">Team Position</p>
            {sfTeam && sfTeam.totalStrokes > 0 ? (
              <p className="text-3xl font-bold tabular-nums mt-0.5">
                {sfRank}
                <span className="font-normal text-white/50">
                  /{sortedTeams.length}
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
      <div className="mx-4 mb-4 flex gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("team")}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
            activeTab === "team"
              ? "bg-white text-usf-green shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Team Standings
        </button>
        <button
          onClick={() => setActiveTab("players")}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
            activeTab === "players"
              ? "bg-white text-usf-green shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Dons Players
        </button>
      </div>

      {activeTab === "team" && (
        <TeamStandings teams={sortedTeams} numRounds={numRounds} />
      )}

      {activeTab === "players" && (
        <DonsPlayers
          players={sfPlayers}
          courses={courses}
          playerRankMap={playerRankMap}
        />
      )}
      </div>
    </>
  );
}

function computePlayerRanks(players: PlayerResult[]): Map<string, { rank: number; isTied: boolean }> {
  const ranked = [...players]
    .filter((p) => p.totalStrokes > 0)
    .sort((a, b) => a.totalScore - b.totalScore);

  const map = new Map<string, { rank: number; isTied: boolean }>();
  for (let i = 0; i < ranked.length; i++) {
    const player = ranked[i];
    const isTied = ranked.some(
      (p, j) => j !== i && p.totalScore === player.totalScore
    );
    map.set(player.playerId, { rank: i + 1, isTied });
  }
  return map;
}
