"use client";

import { Fragment, useState } from "react";
import type { PlayerResult, Course } from "@/lib/types";
import { playerPhotoUrl } from "@/lib/constants";
import { formatScore, scoreColor, ordinal, nineHoleTotal } from "@/lib/format";
import { HoleByHole } from "./HoleByHole";

function PlayerAvatar({ player }: { player: PlayerResult }) {
  if (player.userPicture) {
    return (
      <img
        src={playerPhotoUrl(player.userPicture, 40)}
        alt=""
        className="w-7 h-7 rounded-md object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-md bg-usf-green/10 shrink-0 flex items-center justify-center text-usf-green text-[10px] font-bold">
      {player.playerName
        ?.split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}

function PlayerName({ player }: { player: PlayerResult }) {
  const isPlaying = player.rounds.some((r) => r.status === "in_progress");
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-sm truncate">{player.playerName}</span>
        {player.teamLabel === "IND" && (
          <span className="text-[9px] text-gray-400">IND</span>
        )}
        {isPlaying && (
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
        )}
      </div>
    </div>
  );
}

function ExpandedScorecard({
  player,
  courses,
  colSpan,
  tableRound,
}: {
  player: PlayerResult;
  courses: Course[];
  colSpan: number;
  tableRound: "total" | number;
}) {
  const initialRound = typeof tableRound === "number" ? tableRound : 0;
  const [selectedRound, setSelectedRound] = useState(initialRound);
  const safeRound = Math.min(selectedRound, courses.length - 1);

  // Sync when the parent round pill changes
  const prevTableRound = typeof tableRound === "number" ? tableRound : null;
  if (prevTableRound !== null && prevTableRound !== selectedRound && typeof tableRound === "number") {
    setSelectedRound(tableRound);
  }

  const showRoundSelector = typeof tableRound !== "number" && courses.length > 1;

  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <div className="border-t border-gray-100 bg-gray-50/50">
          {/* Round selector — only in total mode (round mode already selects via pills) */}
          {showRoundSelector && (
            <div className="flex gap-1 px-4 pt-3">
              {courses.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRound(i);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
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

          {/* Hole-by-hole scorecard */}
          <HoleByHole
            round={player.rounds[safeRound] ?? undefined}
            course={courses[safeRound]}
          />
        </div>
      </td>
    </tr>
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
    const colSpan = 3 + courses.length; // Player + rounds + Total + Pos

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
                        className="py-2.5 px-2 text-center tabular-nums text-gray-600"
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
  const colSpan = 5; // Player + Front + Back + Strokes + Score

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
                      score != null ? scoreColor(score) : "text-gray-300"
                    }`}
                  >
                    {score != null
                      ? formatScore(score)
                      : strokes > 0 && course
                        ? formatScore(strokes - course.totalPar)
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
