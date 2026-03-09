"use client";

import { Fragment, useState, useRef, type ReactNode } from "react";
import type { PlayerResult, Course } from "@/lib/types";
import { formatScore, scoreColor, ordinal, nineHoleTotal } from "@/lib/format";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import ExpandedScorecard from "./ExpandedScorecard";

function CollapsibleRow({ isExpanded, colSpan, children }: { isExpanded: boolean; colSpan: number; children: ReactNode }) {
  const hasExpanded = useRef(false);
  if (isExpanded) hasExpanded.current = true;

  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <div className={`grid transition-[grid-template-rows] duration-200 ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className={`overflow-hidden transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
            {hasExpanded.current && children}
          </div>
        </div>
      </td>
    </tr>
  );
}

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function DonsPlayersTable({
  players,
  courses,
  playerRankMap,
  tableRound,
}: {
  players: PlayerResult[];
  courses: Course[];
  playerRankMap: Map<string, { rank: number; isTied: boolean }>;
  tableRound: "total" | number;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (tableRound === "total") {
    const colSpan = 4 + courses.length;

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
              <th className="py-2.5 px-3 text-left font-medium">Player</th>
              {courses.map((_, i) => (
                <th key={i} className="py-2.5 px-2 text-center font-medium">
                  R{i + 1}
                </th>
              ))}
              <th className="py-2.5 px-2 text-center font-medium">Total</th>
              <th className="py-2.5 px-2 text-center font-medium">Pos</th>
              <th className="py-2.5 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {players.map((player) => {
              const hasScores = player.totalStrokes > 0;
              const rankInfo = playerRankMap.get(player.playerId);
              const rank = rankInfo?.rank ?? 0;
              const isTied = rankInfo?.isTied ?? false;
              const isExpanded = expandedIds.has(player.playerId);

              return (
                <Fragment key={player.playerId}>
                  <tr
                    onClick={() => toggle(player.playerId)}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      isExpanded ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <PlayerAvatar player={player} />
                        <PlayerName player={player} />
                      </div>
                    </td>
                    {player.strokes.map((strokes, i) => (
                      <td
                        key={i}
                        className={`py-2.5 px-2 text-center tabular-nums ${strokes > 0 ? "text-gray-600" : "text-gray-300"}`}
                      >
                        {strokes > 0 ? strokes : "–"}
                      </td>
                    ))}
                    <td
                      className={`py-2.5 px-2 text-center tabular-nums font-semibold ${
                        hasScores ? scoreColor(player.totalScore) : "text-gray-300"
                      }`}
                    >
                      {hasScores ? formatScore(player.totalScore) : "–"}
                    </td>
                    <td className="py-2.5 px-2 text-center tabular-nums text-gray-500">
                      {rank > 0
                        ? `${isTied ? "T" : ""}${ordinal(rank)}`
                        : "–"}
                    </td>
                    <td className="py-2.5 pr-3 text-center">
                      <ChevronIcon isExpanded={isExpanded} />
                    </td>
                  </tr>
                  <CollapsibleRow isExpanded={isExpanded} colSpan={colSpan}>
                    <ExpandedScorecard
                      player={player}
                      courses={courses}
                      tableRound={tableRound}
                    />
                  </CollapsibleRow>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Round view
  const roundIndex = tableRound as number;
  const colSpan = 6;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
            <th className="py-2.5 px-3 text-left font-medium">Player</th>
            <th className="py-2.5 px-2 text-center font-medium">Front</th>
            <th className="py-2.5 px-2 text-center font-medium">Back</th>
            <th className="py-2.5 px-2 text-center font-medium">Strokes</th>
            <th className="py-2.5 px-2 text-center font-medium">Score</th>
            <th className="py-2.5 w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {players.map((player) => {
            const round = player.rounds[roundIndex];
            const strokes = player.strokes[roundIndex];
            const score = player.scores?.[roundIndex];
            const front = round ? nineHoleTotal(round.strokes, 0, 9) : null;
            const back = round ? nineHoleTotal(round.strokes, 9, 18) : null;
            const isExpanded = expandedIds.has(player.playerId);

            return (
              <Fragment key={player.playerId}>
                <tr
                  onClick={() => toggle(player.playerId)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    isExpanded ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <PlayerAvatar player={player} />
                      <PlayerName player={player} />
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-gray-600">
                    {front ?? "–"}
                  </td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-gray-600">
                    {back ?? "–"}
                  </td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-gray-600">
                    {strokes > 0 ? strokes : "–"}
                  </td>
                  <td
                    className={`py-2.5 px-2 text-center tabular-nums font-semibold ${
                      score != null && strokes > 0 ? scoreColor(score) : "text-gray-300"
                    }`}
                  >
                    {score != null && strokes > 0 ? formatScore(score) : "–"}
                  </td>
                  <td className="py-2.5 pr-3 text-center">
                    <ChevronIcon isExpanded={isExpanded} />
                  </td>
                </tr>
                <CollapsibleRow isExpanded={isExpanded} colSpan={colSpan}>
                  <ExpandedScorecard
                    player={player}
                    courses={courses}
                    tableRound={tableRound}
                  />
                </CollapsibleRow>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
