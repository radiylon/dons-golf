"use client";

import { useTournaments, useTeamLeaderboard } from "@/lib/hooks";
import { SF_SCHOOL_ID, TOURNAMENT_NAME_OVERRIDES } from "@/lib/constants";
import type { TeamResult, Course } from "@/lib/types";
import TeamStandings from "./TeamStandings";
import SFSummaryBanner from "./SFSummaryBanner";
import ScoreboardTabs from "./ScoreboardTabs";
import type { ScoreboardTab } from "./ScoreboardTabs";
import IndividualTabPanel from "./IndividualTabPanel";
import DonsTabPanel from "./DonsTabPanel";
import LastUpdated from "./LastUpdated";
import PageHeader from "./PageHeader";
import { useState, useMemo } from "react";

const EMPTY_TEAMS: TeamResult[] = [];
const EMPTY_COURSES: Course[] = [];

export default function Scoreboard({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [activeTab, setActiveTab] = useState<ScoreboardTab>("team");

  const tournamentsQuery = useTournaments();

  const tournamentMeta = tournamentsQuery.data?.results.find(
    (t) => t.tournamentId === tournamentId
  );
  const startDate = tournamentMeta?.startDate;

  const teamQuery = useTeamLeaderboard(tournamentId);

  const isLoading = teamQuery.isLoading;
  const isError = teamQuery.isError;
  const isFetching = teamQuery.isFetching;
  const lastUpdated = teamQuery.dataUpdatedAt || 0;

  const tournamentName = TOURNAMENT_NAME_OVERRIDES[tournamentId] ?? tournamentMeta?.tournamentName ?? "Tournament";

  const teams = teamQuery.data?.results ?? EMPTY_TEAMS;
  const courses = teamQuery.data?.courses ?? EMPTY_COURSES;

  const sfTeam = useMemo(() => teams.find((t) => t.schoolId === SF_SCHOOL_ID), [teams]);

  const sfRankInfo = useMemo(() => {
    const idx = teams.findIndex((t) => t.schoolId === SF_SCHOOL_ID);
    if (idx === -1) return { rank: 0, isTied: false, total: teams.length };
    const rank = idx + 1;
    const score = teams[idx].totalScore;
    const isTied = teams.some((t, i) => i !== idx && t.totalStrokes > 0 && t.totalScore === score);
    return { rank, isTied, total: teams.length };
  }, [teams]);

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
        <SFSummaryBanner
          sfTeam={sfTeam}
          sfRankInfo={sfRankInfo}
          isLive={!!isLive}
        />

        <ScoreboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "team" && (
          <TeamStandings teams={teams} numRounds={numRounds} />
        )}

        {activeTab === "individual" && (
          <IndividualTabPanel tournamentId={tournamentId} courses={courses} />
        )}

        {activeTab === "players" && (
          <DonsTabPanel tournamentId={tournamentId} courses={courses} />
        )}
      </div>
    </>
  );
}
