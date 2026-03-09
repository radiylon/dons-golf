"use client";

import { useState, useEffect } from "react";
import type { PlayerResult, Course } from "@/lib/types";
import { HoleByHole } from "./HoleByHole";

export default function ExpandedScorecard({
  player,
  courses,
  tableRound,
}: {
  player: PlayerResult;
  courses: Course[];
  tableRound: "total" | number;
}) {
  const initialRound = typeof tableRound === "number" ? tableRound : 0;
  const [selectedRound, setSelectedRound] = useState(initialRound);
  const safeRound = Math.min(selectedRound, courses.length - 1);

  // Sync when the parent round pill changes
  useEffect(() => {
    if (typeof tableRound === "number") {
      setSelectedRound(tableRound);
    }
  }, [tableRound]);

  const showRoundSelector = typeof tableRound !== "number" && courses.length > 1;

  return (
    <div className="border-t border-gray-100 bg-gray-50/50">
      {showRoundSelector && (
        <div className="flex gap-1 px-4 pt-3">
          {courses.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRound(i);
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                selectedRound === i
                  ? "bg-usf-green text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              R{i + 1}
            </button>
          ))}
        </div>
      )}

      <HoleByHole
        round={player.rounds[safeRound] ?? undefined}
        course={courses[safeRound]}
      />
    </div>
  );
}
