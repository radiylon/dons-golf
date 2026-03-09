"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeamLeaderboard, fetchPlayerLeaderboard, fetchTournaments } from "@/lib/api";
import { SF_SCHOOL_ID, POLL_INTERVAL_MS, schoolLogoUrl } from "@/lib/constants";
import { formatScore, scoreColor } from "@/lib/format";
import type { TeamResult, PlayerResult, Course } from "@/lib/types";
import PlayerCard from "./PlayerCard";
import LastUpdated from "./LastUpdated";
import Link from "next/link";
import { useState } from "react";

function TeamRow({
  team,
  rank,
  isSF,
}: {
  team: TeamResult;
  rank: number;
  isSF: boolean;
}) {
  const hasScores = team.totalStrokes > 0;

  return (
    <tr
      className={
        isSF
          ? "bg-usf-green/5 border-l-4 border-l-usf-green font-semibold"
          : "border-l-4 border-l-transparent"
      }
    >
      <td className="py-2.5 pl-3 pr-2 text-center tabular-nums">{rank}</td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2">
          {team.schoolLogo ? (
            <img
              src={schoolLogoUrl(team.schoolLogo, 32)}
              alt=""
              className="w-5 h-5 object-contain shrink-0"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-200 rounded shrink-0" />
          )}
          <span className={isSF ? "text-usf-green" : ""}>{team.schoolName}</span>
        </div>
      </td>
      <td
        className={`py-2.5 px-2 text-center tabular-nums ${hasScores ? scoreColor(team.totalScore) : "text-gray-400"}`}
      >
        {hasScores ? formatScore(team.totalScore) : "–"}
      </td>
      {team.strokes.map((strokes, i) => (
        <td
          key={i}
          className="py-2.5 px-2 text-center tabular-nums text-gray-500 hidden sm:table-cell"
        >
          {strokes > 0 ? strokes : "–"}
        </td>
      ))}
      <td className="py-2.5 px-2 text-center tabular-nums hidden sm:table-cell">
        {team.totalStrokes > 0 ? team.totalStrokes : "–"}
      </td>
    </tr>
  );
}

export default function Scoreboard({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [activeTab, setActiveTab] = useState<"team" | "players">("team");

  const tournamentsQuery = useQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    staleTime: 5 * 60_000,
  });

  const tournamentMeta = tournamentsQuery.data?.results.find(
    (t) => t.tournamentId === tournamentId
  );
  const startDate = tournamentMeta?.startDate;

  const teamQuery = useQuery({
    queryKey: ["team-leaderboard", tournamentId],
    queryFn: () => fetchTeamLeaderboard(tournamentId),
    refetchInterval: POLL_INTERVAL_MS,
  });

  const playerQuery = useQuery({
    queryKey: ["player-leaderboard", tournamentId],
    queryFn: () => fetchPlayerLeaderboard(tournamentId),
    refetchInterval: POLL_INTERVAL_MS,
  });

  const isLoading = teamQuery.isLoading || playerQuery.isLoading;
  const isError = teamQuery.isError || playerQuery.isError;
  const isFetching = teamQuery.isFetching || playerQuery.isFetching;
  const lastUpdated = Math.max(
    teamQuery.dataUpdatedAt || 0,
    playerQuery.dataUpdatedAt || 0
  );

  const tournamentName = tournamentMeta?.tournamentName ?? "Tournament";

  const header = (
    <header className="bg-usf-green px-4 pt-12 pb-5 mb-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-white/60 text-xs hover:text-white/80 transition-colors mb-2"
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
        <h1 className="text-white text-xl font-bold">{tournamentName}</h1>
      </div>
    </header>
  );

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

  // Precompute player rankings once instead of per-card
  const rankedPlayers = [...players]
    .filter((p) => p.totalStrokes > 0)
    .sort((a, b) => a.totalScore - b.totalScore);

  const playerRankMap = new Map<string, { rank: number; isTied: boolean }>();
  for (let i = 0; i < rankedPlayers.length; i++) {
    const player = rankedPlayers[i];
    const isTied = rankedPlayers.some(
      (p, j) => j !== i && p.totalScore === player.totalScore
    );
    playerRankMap.set(player.playerId, { rank: i + 1, isTied });
  }

  return (
    <>
      {header}

      <div className="max-w-lg mx-auto pt-2">
      {/* Course info */}
      <div className="mx-4 mb-4">
        <h2 className="text-base font-semibold text-gray-900">{courseName}</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Par {totalPar} · {totalYards.toLocaleString()} yards · {numRounds} rounds
        </p>
      </div>

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
            <p className="text-white/60 text-xs">Team Position</p>
            {sfTeam && sfTeam.totalStrokes > 0 ? (
              <p className="text-lg font-bold tabular-nums mt-0.5">
                {sfRank}
                <span className="font-normal text-white/50">
                  /{sortedTeams.length}
                </span>
              </p>
            ) : (
              <p className="text-2xl font-bold tabular-nums">–</p>
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

      {/* Last Updated */}
      <LastUpdated timestamp={lastUpdated} isFetching={isFetching} />

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

function TeamStandings({
  teams,
  numRounds,
}: {
  teams: TeamResult[];
  numRounds: number;
}) {
  return (
    <div className="mx-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
            <th className="py-2.5 pl-3 pr-2 text-center font-medium w-10">
              #
            </th>
            <th className="py-2.5 px-2 text-left font-medium">Team</th>
            <th className="py-2.5 px-2 text-center font-medium">Score</th>
            {Array.from({ length: numRounds }, (_, i) => (
              <th
                key={i}
                className="py-2.5 px-2 text-center font-medium hidden sm:table-cell"
              >
                R{i + 1}
              </th>
            ))}
            <th className="py-2.5 px-2 text-center font-medium hidden sm:table-cell">
              Tot
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {teams.map((team, i) => (
            <TeamRow
              key={team.schoolId}
              team={team}
              rank={i + 1}
              isSF={team.schoolId === SF_SCHOOL_ID}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DonsPlayers({
  players,
  courses,
  playerRankMap,
}: {
  players: PlayerResult[];
  courses: Course[];
  playerRankMap: Map<string, { rank: number; isTied: boolean }>;
}) {
  return (
    <div className="mx-4 space-y-3">
      {players.map((player) => (
        <PlayerCard
          key={player.playerId}
          player={player}
          courses={courses}
          playerRankMap={playerRankMap}
        />
      ))}
    </div>
  );
}
