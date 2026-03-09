"use client";

import { Fragment, useState } from "react";
import type { PlayerResult, Course } from "@/lib/types";
import { formatScore, scoreColor, ordinal, nineHoleTotal } from "@/lib/format";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import ExpandedScorecard from "./ExpandedScorecard";

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
    const colSpan = 3 + courses.length;

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
                  </tr>
                  {isExpanded && (
                    <ExpandedScorecard
                      player={player}
                      courses={courses}
                      colSpan={colSpan}
                      tableRound={tableRound}
                    />
                  )}
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
  const course = courses[roundIndex];
  const colSpan = 5;

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
                </tr>
                {isExpanded && (
                  <ExpandedScorecard
                    player={player}
                    courses={courses}
                    colSpan={colSpan}
                    tableRound={tableRound}
                  />
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
