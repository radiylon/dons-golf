"use client";

import { useState } from "react";
import type { PlayerResult, Course } from "@/lib/types";
import PlayerTable from "./PlayerTable";

export default function PlayerTableSection({
  players,
  courses,
  playerRankMap,
  showSchool,
}: {
  players: PlayerResult[];
  courses: Course[];
  playerRankMap: Map<string, { rank: number; isTied: boolean }>;
  showSchool?: boolean;
}) {
  const [tableRound, setTableRound] = useState<"total" | number>("total");

  return (
    <div className="mx-4">
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setTableRound("total")}
          className={`text-xs px-2.5 py-1.5 rounded-full font-medium transition-colors ${
            tableRound === "total"
              ? "bg-usf-green text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Total
        </button>
        {courses.map((_, i) => (
          <button
            key={i}
            onClick={() => setTableRound(i)}
            className={`text-xs px-2.5 py-1.5 rounded-full font-medium transition-colors ${
              tableRound === i
                ? "bg-usf-green text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            R{i + 1}
          </button>
        ))}
      </div>

      <PlayerTable
        players={players}
        courses={courses}
        playerRankMap={playerRankMap}
        tableRound={tableRound}
        showSchool={showSchool}
      />
    </div>
  );
}
