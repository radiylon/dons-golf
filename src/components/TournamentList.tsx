"use client";

import { useState } from "react";
import { useTournaments } from "@/lib/hooks";
import { seasonLabel } from "@/lib/constants";
import type { Tournament } from "@/lib/types";
import Link from "next/link";

type TournamentStatus = "live" | "upcoming" | "completed";

function getTournamentStatus(t: Tournament): TournamentStatus {
  if (t.isComplete) return "completed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(t.startDate + "T00:00:00");
  const end = new Date(t.endDate + "T23:59:59");

  if (start <= today && today <= end) return "live";

  // Past tournaments that aren't marked complete
  if (end < today) return "completed";

  return "upcoming";
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.toLocaleDateString("en-US", opts)}–${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  return `${startDate.toLocaleDateString("en-US", opts)} – ${endDate.toLocaleDateString("en-US", opts)}, ${startDate.getFullYear()}`;
}

function StatusBadge({ status }: { status: TournamentStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        Live
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wider bg-usf-gold/15 text-usf-green px-2 py-0.5 rounded-full">
        Upcoming
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
      Completed
    </span>
  );
}

function CardContent({ tournament, status }: { tournament: Tournament; status: TournamentStatus }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <StatusBadge status={status} />
          <h3 className="font-semibold text-sm text-gray-900 truncate mt-1">
            {tournament.tournamentName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {tournament.venue.split(" - ").slice(0, 1).join("")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDateRange(tournament.startDate, tournament.endDate)}
            {" · "}
            {tournament.plannedRounds} rounds
          </p>
        </div>
        <svg
          className="w-4 h-4 text-gray-300 mt-1 shrink-0"
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
    </div>
  );
}

function TournamentCard({ tournament, status }: { tournament: Tournament; status: TournamentStatus }) {
  return (
    <Link
      href={`/tournament/${tournament.tournamentId}`}
      className={`block bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md ${
        status === "live"
          ? "border-red-200 ring-1 ring-red-100"
          : status === "upcoming"
            ? "border-gray-200 opacity-75"
            : "border-gray-200"
      }`}
    >
      <CardContent tournament={tournament} status={status} />
    </Link>
  );
}

export default function TournamentList() {
  const { data, isLoading, isError } = useTournaments();

  const tournaments = data?.results ?? [];

  // Extract available seasons from data, sorted newest first
  const availableSeasons = [
    ...new Set(tournaments.map((t) => t.season)),
  ].sort((a, b) => b - a);

  const [selectedSeason, setSelectedSeason] = useState<number | "all" | null>(null);

  // Default to the latest season once data loads
  const activeSeason = selectedSeason ?? (availableSeasons[0] || "all");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-usf-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-4 my-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        Failed to load tournaments.
      </div>
    );
  }

  const filteredTournaments =
    activeSeason === "all"
      ? tournaments
      : tournaments.filter((t) => t.season === activeSeason);

  // Flat list ordered: live first, then upcoming, then completed
  const ordered = filteredTournaments
    .map((tournament) => ({ tournament, status: getTournamentStatus(tournament) }))
    .sort((a, b) => {
      const priority: Record<TournamentStatus, number> = { live: 0, upcoming: 1, completed: 2 };
      return priority[a.status] - priority[b.status];
    });

  return (
    <div className="mx-4 space-y-4">
      {/* Season filter */}
      {availableSeasons.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {availableSeasons.map((season) => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeSeason === season
                  ? "bg-usf-green text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {seasonLabel(season)}
            </button>
          ))}
        </div>
      )}

      {ordered.length > 0 ? (
        <div className="space-y-3">
          {ordered.map(({ tournament, status }) => (
            <TournamentCard key={tournament.tournamentId} tournament={tournament} status={status} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-400 text-sm">No tournaments found for this season.</p>
        </div>
      )}
    </div>
  );
}
