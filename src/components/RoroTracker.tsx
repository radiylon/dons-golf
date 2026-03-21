"use client";

import { usePlayerLeaderboard, useTournaments } from "@/lib/hooks";
import { RORO_PLAYER_NAME, TOURNAMENT_NAME_OVERRIDES } from "@/lib/constants";
import { computePlayerRanks } from "@/lib/ranks";
import { getActiveTournament, findRoro, getClassYear } from "@/lib/tournaments";
import HoleByHole from "./HoleByHole";
import NineHoles from "./NineHoles";
import RoroHeroCard from "./RoroHeroCard";
import RoroRoundCards from "./RoroRoundCards";
import PageHeader from "./PageHeader";
import Link from "next/link";

export default function RoroTracker() {
  const tournamentsQuery = useTournaments();
  const tournaments = tournamentsQuery.data?.results ?? [];

  const detected = getActiveTournament(tournaments);
  const activeTournamentId = detected?.id ?? null;
  const tournamentIsLive = detected?.isLive ?? false;

  const playerQuery = usePlayerLeaderboard(activeTournamentId ?? "");

  const isLoading =
    tournamentsQuery.isLoading ||
    (!!activeTournamentId && playerQuery.isLoading);

  const allPlayers = playerQuery.data?.results ?? [];
  const courses = playerQuery.data?.courses ?? [];
  const roro = activeTournamentId ? findRoro(allPlayers) : null;

  const activeTournament = tournaments.find(
    (t) => t.tournamentId === activeTournamentId
  );

  const playerIsLive =
    roro?.rounds.some((r) => r.status === "in_progress") ?? false;

  const hasScores = roro ? roro.totalStrokes > 0 : false;

  const { rankMap } = computePlayerRanks(allPlayers);
  const rankEntry = roro && hasScores ? rankMap.get(roro.playerId) : null;
  const rankInfo = rankEntry ? { ...rankEntry, total: rankMap.size } : null;

  const rawCourseName = courses[0]?.courseName || "";
  const courseName = rawCourseName.replace(/\bTpc\b/g, "TPC");
  const totalPar = courses[0]?.totalPar;
  const totalYards = courses[0]?.totalYards;

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
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
          </div>
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
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 rounded-xl border border-gray-200 p-3 w-[120px] h-24 bg-white" />
            ))}
          </div>
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
        {/* Tournament Info */}
        {activeTournament && (
          <Link
            href={`/tournament/${activeTournamentId}`}
            className="block mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300"
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
              </p>
            )}
          </Link>
        )}

        <RoroHeroCard
          roro={roro}
          hasScores={hasScores}
          playerIsLive={playerIsLive}
          rankInfo={rankInfo}
        />

        {roro && courses.length > 0 && (
          <RoroRoundCards roro={roro} courses={courses} />
        )}

        {/* All Round Scorecards */}
        {courses.length > 0 && (
          <div className="space-y-4">
            {courses.map((course, i) => {
              const round = roro?.rounds[i];
              const roundIsLive = round?.status === "in_progress";
              const hasRoundStrokes = round?.strokes.some((s) => s !== null);

              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      Round {i + 1}
                    </span>
                    {roundIsLive && round?.thru && (
                      <span className="text-xs text-gray-400">
                        Thru {round.thru}
                      </span>
                    )}
                  </div>
                  {hasRoundStrokes ? (
                    <HoleByHole round={round} course={course} />
                  ) : (
                    <div className="px-4 py-3 space-y-2 overflow-x-auto">
                      <NineHoles
                        holes={{ start: 0, end: 9, label: "OUT" }}
                        pars={course?.pars ?? []}
                        strokes={emptyStrokes}
                        yards={course?.yards}
                      />
                      <NineHoles
                        holes={{ start: 9, end: 18, label: "IN" }}
                        pars={course?.pars ?? []}
                        strokes={emptyStrokes}
                        yards={course?.yards}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
