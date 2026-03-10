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
      <div className="mx-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-8 w-16 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
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
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap cursor-pointer ${
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
