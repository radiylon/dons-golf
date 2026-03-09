"use client";

import { Fragment, useState } from "react";
import type { PlayerResult, Course } from "@/lib/types";
import { SF_SCHOOL_ID, schoolLogoUrl } from "@/lib/constants";
import { formatScore, scoreColor, ordinal, nineHoleTotal } from "@/lib/format";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import ExpandedScorecard from "./ExpandedScorecard";
import CollapsibleRow from "./CollapsibleRow";
import ChevronIcon from "./ChevronIcon";

export default function PlayerTable({
  players,
  courses,
  playerRankMap,
  tableRound,
  showSchool,
}: {
  players: PlayerResult[];
  courses: Course[];
  playerRankMap: Map<string, { rank: number; isTied: boolean }>;
  tableRound: "total" | number;
  showSchool?: boolean;
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
    const colSpan = 5 + courses.length;

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
              <th className="py-2.5 px-2 text-center font-medium">Tot</th>
              <th className="py-2.5 px-2 text-center font-medium">Score</th>
              <th className="py-2.5 px-2 text-center font-medium">Pos</th>
              <th className="py-2.5 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {players.map((player) => {
              const isSF = !!showSchool && player.schoolId === SF_SCHOOL_ID;
              const hasScores = player.totalStrokes > 0;
              const rankInfo = playerRankMap.get(player.playerId);
              const rank = rankInfo?.rank ?? 0;
              const isTied = rankInfo?.isTied ?? false;
              const isExpanded = expandedIds.has(player.playerId);

              return (
                <Fragment key={player.playerId}>
                  <tr
                    onClick={() => toggle(player.playerId)}
                    className={`cursor-pointer transition-colors ${
                      isSF
                        ? `bg-usf-green/5 border-l-4 border-l-usf-green ${isExpanded ? "bg-usf-green/10" : "hover:bg-usf-green/10"}`
                        : showSchool
                          ? `border-l-4 border-l-transparent ${isExpanded ? "bg-gray-50" : "hover:bg-gray-50"}`
                          : isExpanded ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <PlayerCell player={player} showSchool={showSchool} isSF={isSF} />
                    </td>
                    {courses.map((_, i) => {
                      const strokes = player.strokes[i];
                      return (
                        <td
                          key={i}
                          className={`py-2.5 px-2 text-center tabular-nums ${strokes > 0 ? "text-gray-600" : "text-gray-300"}`}
                        >
                          {strokes > 0 ? strokes : "–"}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-2 text-center tabular-nums font-semibold text-gray-600">
                      {hasScores ? player.totalStrokes : "–"}
                    </td>
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
            const isSF = !!showSchool && player.schoolId === SF_SCHOOL_ID;
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
                  className={`cursor-pointer transition-colors ${
                    isSF
                      ? `bg-usf-green/5 border-l-4 border-l-usf-green ${isExpanded ? "bg-usf-green/10" : "hover:bg-usf-green/10"}`
                      : showSchool
                        ? `border-l-4 border-l-transparent ${isExpanded ? "bg-gray-50" : "hover:bg-gray-50"}`
                        : isExpanded ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <PlayerCell player={player} showSchool={showSchool} isSF={isSF} />
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

function PlayerCell({
  player,
  showSchool,
  isSF,
}: {
  player: PlayerResult;
  showSchool?: boolean;
  isSF: boolean;
}) {
  const isPlaying = player.rounds.some((r) => r.status === "in_progress" || r.status === "played");

  return (
    <div className="flex items-center gap-2">
      <PlayerAvatar player={player} />
      {showSchool ? (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-medium text-sm truncate ${isSF ? "text-usf-green" : ""}`}>
              {player.playerName}
            </span>
            {player.teamLabel === "IND" && (
              <span className="text-[9px] text-gray-400">IND</span>
            )}
            {isPlaying && (
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {player.schoolLogo ? (
              <img
                src={schoolLogoUrl(player.schoolLogo, 24)}
                alt=""
                className="w-3.5 h-3.5 object-contain shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-3.5 h-3.5 bg-gray-200 rounded-sm shrink-0" />
            )}
            <span className="text-xs text-gray-400 truncate">{player.schoolName}</span>
          </div>
        </div>
      ) : (
        <PlayerName player={player} />
      )}
    </div>
  );
}
