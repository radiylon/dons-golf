import { TOURNAMENT_NAME_OVERRIDES } from "@/lib/constants";
import { type TournamentStatus, formatDateRange } from "@/lib/format";
import type { Tournament } from "@/lib/types";
import Link from "next/link";

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

export default function TournamentCard({
  tournament,
  status,
}: {
  tournament: Tournament;
  status: TournamentStatus;
}) {
  return (
    <Link
      href={`/tournament/${tournament.tournamentId}`}
      className={`block bg-white rounded-xl border overflow-hidden hover:shadow-md ${
        status === "live"
          ? "border-red-200 ring-1 ring-red-100"
          : status === "upcoming"
            ? "border-gray-200 opacity-75"
            : "border-gray-200"
      }`}
    >
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <StatusBadge status={status} />
            <h3 className="font-semibold text-sm text-gray-900 truncate mt-1">
              {TOURNAMENT_NAME_OVERRIDES[tournament.tournamentId] ?? tournament.tournamentName}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {tournament.venue.split(" - ").slice(0, 1).join("")}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDateRange(tournament.startDate, tournament.endDate)}
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
    </Link>
  );
}
