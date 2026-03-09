"use client";

import { useState } from "react";
import { useTournaments } from "@/lib/hooks";
import { seasonLabel } from "@/lib/constants";
import { getTournamentStatus, type TournamentStatus } from "@/lib/format";
import TournamentCard from "./TournamentCard";

export default function TournamentList() {
  const { data, isLoading, isError } = useTournaments();

  const tournaments = data?.results ?? [];

  const availableSeasons = [
    ...new Set(tournaments.map((t) => t.season)),
  ].sort((a, b) => b - a);

  const [selectedSeason, setSelectedSeason] = useState<number | "all" | null>(null);

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

  const ordered = filteredTournaments
    .map((tournament) => ({ tournament, status: getTournamentStatus(tournament) }))
    .sort((a, b) => {
      const priority: Record<TournamentStatus, number> = { live: 0, upcoming: 1, completed: 2 };
      return priority[a.status] - priority[b.status];
    });

  return (
    <div className="mx-4 space-y-4">
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
