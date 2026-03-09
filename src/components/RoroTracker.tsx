"use client";

import { useState } from "react";
import { useTournaments, usePlayerLeaderboard } from "@/lib/hooks";
import {
  SF_SCHOOL_ID,
  RORO_PLAYER_NAME,
  RORO_ENROLLMENT_YEAR,
  TOURNAMENT_NAME_OVERRIDES,
  playerPhotoUrl,
} from "@/lib/constants";
import { formatScore, scoreColor, nineHoleTotal, ordinal, getTournamentStatus } from "@/lib/format";
import { HoleByHole, NineHoles } from "./HoleByHole";
import LastUpdated from "./LastUpdated";
import PageHeader from "./PageHeader";
import Link from "next/link";
import type { Tournament, PlayerResult } from "@/lib/types";

const CLASS_YEARS = ["Freshman", "Sophomore", "Junior", "Senior"] as const;

function getClassYear(): string {
  const now = new Date();
  // Academic year starts in August
  const academicYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const yearsIn = academicYear - RORO_ENROLLMENT_YEAR;
  return CLASS_YEARS[Math.min(Math.max(yearsIn, 0), 3)];
}

function autoDetectTournament(
  tournaments: Tournament[]
): { id: string; isLive: boolean } | null {
  const withResults = tournaments.filter((t) => t.hasResults);

  const live = withResults.find((t) => getTournamentStatus(t) === "live");
  if (live) return { id: live.tournamentId, isLive: true };

  const completed = withResults
    .filter((t) => getTournamentStatus(t) === "completed")
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
  if (completed.length > 0)
    return { id: completed[0].tournamentId, isLive: false };

  return null;
}

function findRoro(players: PlayerResult[]): PlayerResult | null {
  const exact = players.find(
    (p) => p.playerName === RORO_PLAYER_NAME && p.schoolId === SF_SCHOOL_ID
  );
  if (exact) return exact;

  const fallback = players.find(
    (p) =>
      p.playerName?.toLowerCase().includes("rodaylin") &&
      p.schoolId === SF_SCHOOL_ID
  );
  return fallback ?? null;
}

function computeRank(
  roro: PlayerResult,
  allPlayers: PlayerResult[]
): { rank: number; total: number; isTied: boolean } {
  const ranked = allPlayers
    .filter((p) => p.totalStrokes > 0)
    .sort((a, b) => a.totalScore - b.totalScore);

  const total = ranked.length;
  const index = ranked.findIndex((p) => p.playerId === roro.playerId);
  if (index === -1) return { rank: 0, total, isTied: false };

  const rank = index + 1;
  const isTied = ranked.some(
    (p, j) => j !== index && p.totalScore === roro.totalScore
  );
  return { rank, total, isTied };
}

export default function RoroTracker() {
  const [selectedRound, setSelectedRound] = useState<number>(0);

  const tournamentsQuery = useTournaments();
  const tournaments = tournamentsQuery.data?.results ?? [];

  const detected = autoDetectTournament(tournaments);
  const activeTournamentId = detected?.id ?? null;
  const tournamentIsLive = detected?.isLive ?? false;

  const playerQuery = usePlayerLeaderboard(activeTournamentId ?? "");

  const isLoading =
    tournamentsQuery.isLoading ||
    (!!activeTournamentId && playerQuery.isLoading);
  const isFetching = playerQuery.isFetching;
  const lastUpdated = playerQuery.dataUpdatedAt || 0;

  const allPlayers = playerQuery.data?.results ?? [];
  const courses = playerQuery.data?.courses ?? [];
  const roro = activeTournamentId ? findRoro(allPlayers) : null;

  const activeTournament = tournaments.find(
    (t) => t.tournamentId === activeTournamentId
  );

  // Determine player-level live state & active round
  const playerIsLive =
    roro?.rounds.some((r) => r.status === "in_progress") ?? false;
  const effectiveRound = Math.min(
    selectedRound,
    Math.max(courses.length - 1, 0)
  );

  const hasScores = roro ? roro.totalStrokes > 0 : false;
  const rankInfo = roro && hasScores ? computeRank(roro, allPlayers) : null;

  // Course info
  const rawCourseName = courses[0]?.courseName || "";
  const courseName = rawCourseName.replace(/\bTpc\b/g, "TPC");
  const totalPar = courses[0]?.totalPar;
  const totalYards = courses[0]?.totalYards;
  const numRounds = courses.length;

  const classYear = getClassYear();

  const header = (
    <PageHeader
      title={RORO_PLAYER_NAME}
      subtitle={`${classYear} · Women's Golf`}
    />
  );

  if (isLoading) {
    return (
      <>
        {header}
        <div className="max-w-lg mx-auto px-4 pt-2 space-y-4 animate-pulse">
          {/* Tournament link skeleton */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
          </div>
          {/* Hero card skeleton */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-36" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            </div>
            <div className="bg-usf-green/20 h-16" />
          </div>
          {/* Round cards skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 rounded-xl border border-gray-200 p-3 w-[120px] h-24 bg-white" />
            ))}
          </div>
          {/* Scorecard skeleton */}
          <div className="bg-white border border-gray-200 rounded-xl h-48" />
        </div>
      </>
    );
  }

  if (!activeTournamentId) {
    return (
      <>
        {header}
        <div className="max-w-lg mx-auto px-4 mt-2">
          <div className="p-6 bg-white border border-gray-200 rounded-xl text-center">
            <p className="text-gray-500 text-sm">
              No tournament data available yet.
            </p>
          </div>
        </div>
      </>
    );
  }

  const emptyStrokes: (number | null)[] = Array(18).fill(null);

  return (
    <>
      {header}

      <div className="max-w-lg mx-auto px-4">
        {/* LastUpdated (only when live) */}
        {tournamentIsLive && (
          <div className="flex justify-end py-2 mb-2">
            <LastUpdated timestamp={lastUpdated} isFetching={isFetching} />
          </div>
        )}

        {/* Tournament Info */}
        {activeTournament && (
          <Link
            href={`/tournament/${activeTournamentId}`}
            className="block mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {tournamentIsLive && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-full shrink-0">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {TOURNAMENT_NAME_OVERRIDES[activeTournament.tournamentId] ?? activeTournament.tournamentName}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 shrink-0 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            {courseName && (
              <p className="text-xs text-gray-500 mt-0.5">
                {courseName}
                {totalPar ? ` · Par ${totalPar}` : ""}
                {totalYards ? ` · ${totalYards.toLocaleString()} yards` : ""}
                {numRounds > 0 ? ` · ${numRounds} rounds` : ""}
              </p>
            )}
          </Link>
        )}

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
          <div className="p-5 flex items-center gap-4">
            {roro?.userPicture ? (
              <img
                src={playerPhotoUrl(roro.userPicture, 160)}
                alt={RORO_PLAYER_NAME}
                className="w-24 h-24 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-usf-green/10 shrink-0 flex items-center justify-center text-usf-green text-2xl font-bold">
                RM
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-lg text-gray-900">
                {RORO_PLAYER_NAME}
              </h2>
              {playerIsLive && roro && (
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Live
                  </span>
                  {roro.holeThrough && (
                    <span className="text-xs text-gray-400">
                      Thru {roro.holeThrough}
                    </span>
                  )}
                </div>
              )}
              {!roro && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Not competing in this tournament
                </p>
              )}
              {roro && !hasScores && !playerIsLive && (
                <p className="text-xs text-gray-400 mt-1.5">No scores yet</p>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-usf-green grid grid-cols-3 divide-x divide-white/20">
            <div className="py-3 text-center">
              <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">
                Score
              </p>
              <p
                className={`text-xl font-bold tabular-nums mt-0.5 ${
                  hasScores ? "text-white" : "text-white/40"
                }`}
              >
                {hasScores ? formatScore(roro!.totalScore) : "–"}
              </p>
            </div>
            <div className="py-3 text-center">
              <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">
                Position
              </p>
              <p
                className={`text-xl font-bold tabular-nums mt-0.5 ${
                  rankInfo ? "text-white" : "text-white/40"
                }`}
              >
                {rankInfo ? (
                  <>
                    {rankInfo.isTied ? "T" : ""}
                    {ordinal(rankInfo.rank)}
                    <span className="font-normal text-white/50 text-sm">
                      /{rankInfo.total}
                    </span>
                  </>
                ) : (
                  "–"
                )}
              </p>
            </div>
            <div className="py-3 text-center">
              <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">
                Strokes
              </p>
              <p
                className={`text-xl font-bold tabular-nums mt-0.5 ${
                  hasScores ? "text-white" : "text-white/40"
                }`}
              >
                {hasScores ? roro!.totalStrokes : "–"}
              </p>
            </div>
          </div>
        </div>

        {/* Round Summary Cards */}
        {roro && courses.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {courses.map((_, i) => {
              const round = roro.rounds[i];
              const strokes = roro.strokes[i];
              const score = roro.scores?.[i];
              const roundIsLive = round?.status === "in_progress";
              const hasRoundScores = strokes > 0;
              const front = round
                ? nineHoleTotal(round.strokes, 0, 9)
                : null;
              const back = round
                ? nineHoleTotal(round.strokes, 9, 18)
                : null;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedRound(i)}
                  className={`flex-shrink-0 rounded-xl border p-3 min-w-[120px] text-left transition-all ${
                    effectiveRound === i
                      ? "border-usf-green bg-usf-green/5 ring-1 ring-usf-green/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs font-semibold text-gray-900">
                      R{i + 1}
                    </span>
                    {roundIsLive && (
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  {hasRoundScores ? (
                    <>
                      <p
                        className={`text-lg font-bold tabular-nums ${
                          score != null ? scoreColor(score) : "text-gray-600"
                        }`}
                      >
                        {score != null ? formatScore(score) : strokes}
                      </p>
                      <p className="text-[11px] text-gray-400 tabular-nums mt-0.5">
                        {strokes} strokes
                      </p>
                      {(front !== null || back !== null) && (
                        <p className="text-[11px] text-gray-400 tabular-nums">
                          {front ?? "–"} / {back ?? "–"}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-lg font-bold text-gray-300">–</p>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Hole-by-Hole Scorecard */}
        {courses.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Round {effectiveRound + 1}
              </span>
              {roro?.rounds[effectiveRound]?.status === "in_progress" &&
                roro.rounds[effectiveRound]?.thru && (
                  <span className="text-xs text-gray-400">
                    Thru {roro.rounds[effectiveRound].thru}
                  </span>
                )}
            </div>
            {roro?.rounds[effectiveRound]?.strokes.some(
              (s) => s !== null
            ) ? (
              <HoleByHole
                round={roro.rounds[effectiveRound]}
                course={courses[effectiveRound]}
              />
            ) : (
              <div className="px-4 py-3 space-y-2 overflow-x-auto">
                <NineHoles
                  holes={{ start: 0, end: 9, label: "OUT" }}
                  pars={courses[effectiveRound]?.pars ?? []}
                  strokes={emptyStrokes}
                />
                <NineHoles
                  holes={{ start: 9, end: 18, label: "IN" }}
                  pars={courses[effectiveRound]?.pars ?? []}
                  strokes={emptyStrokes}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
