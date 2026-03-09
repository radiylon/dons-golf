"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "@/lib/api";
import type { Tournament } from "@/lib/types";
import Link from "next/link";

type TournamentStatus = "live" | "upcoming" | "completed";

function getTournamentStatus(t: Tournament): TournamentStatus {
  if (t.isComplete) return "completed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(t.startDate + "T00:00:00");
  const end = new Date(t.endDate + "T23:59:59");
  const msPerDay = 86_400_000;
  const daysUntilStart = (start.getTime() - today.getTime()) / msPerDay;

  if (start <= today && today <= end) return "live";
  if (daysUntilStart > 0 && daysUntilStart <= 1) return "live";

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
  return null;
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
        {status !== "upcoming" && (
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
        )}
      </div>
    </div>
  );
}

function TournamentCard({ tournament, status }: { tournament: Tournament; status: TournamentStatus }) {
  if (status === "upcoming") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden opacity-75">
        <CardContent tournament={tournament} status={status} />
      </div>
    );
  }

  return (
    <Link
      href={`/tournament/${tournament.tournamentId}`}
      className={`block bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md ${
        status === "live"
          ? "border-red-200 ring-1 ring-red-100"
          : "border-gray-200"
      }`}
    >
      <CardContent tournament={tournament} status={status} />
    </Link>
  );
}

export default function TournamentList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    staleTime: 5 * 60_000,
  });

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

  const tournaments = data?.results ?? [];

  const grouped = tournaments.reduce(
    (acc, tournament) => {
      const status = getTournamentStatus(tournament);
      acc[status].push({ tournament, status });
      return acc;
    },
    { live: [] as { tournament: Tournament; status: TournamentStatus }[], upcoming: [] as { tournament: Tournament; status: TournamentStatus }[], completed: [] as { tournament: Tournament; status: TournamentStatus }[] }
  );

  const { live, upcoming, completed } = grouped;

  return (
    <div className="mx-4 space-y-6">
      {live.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
            Live Now
          </h2>
          <div className="space-y-3">
            {live.map(({ tournament, status }) => (
              <TournamentCard key={tournament.tournamentId} tournament={tournament} status={status} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map(({ tournament, status }) => (
              <TournamentCard key={tournament.tournamentId} tournament={tournament} status={status} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
            Completed
          </h2>
          <div className="space-y-3">
            {completed.map(({ tournament, status }) => (
              <TournamentCard key={tournament.tournamentId} tournament={tournament} status={status} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
