"use client";

import { useState } from "react";
import type { PlayerResult, Course } from "@/lib/types";
import { playerPhotoUrl } from "@/lib/constants";
import { formatScore, scoreColor, ordinal } from "@/lib/format";

function holeScoreClass(score: number | null, par: number): string {
  if (score === null) return "";
  const diff = score - par;
  if (diff <= -2) return "bg-eagle text-white rounded-full";
  if (diff === -1) return "bg-birdie text-white rounded-full";
  if (diff === 1) return "bg-bogey text-white rounded-full";
  if (diff >= 2) return "bg-double text-white rounded-full";
  return "";
}

export default function PlayerCard({
  player,
  courses,
  playerRankMap,
}: {
  player: PlayerResult;
  courses: Course[];
  playerRankMap: Map<string, { rank: number; isTied: boolean }>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedRound, setSelectedRound] = useState(0);

  // Clamp selectedRound to valid range for courses
  const safeRound = Math.min(selectedRound, courses.length - 1);

  const hasScores = player.totalStrokes > 0;
  const thru = parseInt(player.holeThrough) || 0;
  const isPlaying = player.rounds.some((r) => r.status === "in_progress");

  const rankInfo = playerRankMap.get(player.playerId);
  const playerRank = rankInfo?.rank ?? 0;
  const isTied = rankInfo?.isTied ?? false;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {player.userPicture ? (
            <img
              src={playerPhotoUrl(player.userPicture, 64)}
              alt=""
              className="w-9 h-9 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-usf-green/10 shrink-0 flex items-center justify-center text-usf-green text-xs font-bold">
              {player.playerName ? player.playerName.split(" ").map((n) => n[0]).join("") : "?"}
            </div>
          )}
          <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">
              {player.playerName}
            </span>
            {player.teamLabel === "IND" && (
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                IND
              </span>
            )}
            {isPlaying && (
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {hasScores ? (
              <>
                {playerRank > 0 && (
                  <span className="text-gray-500">{isTied ? "T" : ""}{ordinal(playerRank)}</span>
                )}
                {thru > 0 && thru < 18 && (
                  <span>
                    {" "}
                    · Thru {thru}
                  </span>
                )}
              </>
            ) : (
              <>
                {player.rounds[0]?.teeTime
                  ? `Tee time: ${new Date(player.rounds[0].teeTime).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}`
                  : "No tee time"}
              </>
            )}
          </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-lg font-bold tabular-nums ${
              hasScores
                ? scoreColor(player.totalScore)
                : "text-gray-300"
            }`}
          >
            {hasScores ? formatScore(player.totalScore) : "–"}
          </span>
          <svg
            className={`w-4 h-4 text-gray-300 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded scorecard */}
      {expanded && (
        <div className="border-t border-gray-100">
          {/* Round selector */}
          {courses.length > 1 && (
            <div className="flex gap-1 px-4 pt-3">
              {courses.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedRound(i)}
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

          {/* Scorecard */}
          <HoleByHole
            round={player.rounds[safeRound] ?? undefined}
            course={courses[safeRound]}
          />

          {/* Round summaries */}
          <div className="px-4 pb-3 flex gap-2">
            {courses.map((_, i) => {
              const roundStrokes = player.strokes[i];
              const roundScore = player.scores?.[i];
              return (
                <div
                  key={i}
                  className="text-xs bg-gray-50 rounded-lg px-2.5 py-1.5 text-center"
                >
                  <span className="text-gray-400">R{i + 1}: </span>
                  <span className="font-semibold tabular-nums text-gray-700">
                    {roundStrokes > 0 ? roundStrokes : "–"}
                  </span>
                  {roundScore != null && roundScore !== 0 && (
                    <span
                      className={`ml-1 ${roundScore < 0 ? "text-birdie" : "text-bogey"}`}
                    >
                      ({formatScore(roundScore)})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function HoleByHole({
  round,
  course,
}: {
  round: PlayerResult["rounds"][0] | undefined;
  course: Course | undefined;
}) {
  if (!round || !course) {
    return (
      <p className="px-4 py-6 text-sm text-gray-400 text-center">
        No scores yet
      </p>
    );
  }

  const hasAnyScores = round.strokes.some((stroke) => stroke !== null);

  if (!hasAnyScores) {
    return (
      <p className="px-4 py-6 text-sm text-gray-400 text-center">
        No scores yet
      </p>
    );
  }

  const front9 = { start: 0, end: 9, label: "OUT" };
  const back9 = { start: 9, end: 18, label: "IN" };

  return (
    <div className="px-4 py-3 space-y-2 overflow-x-auto">
      <NineHoles
        holes={front9}
        pars={course.pars}
        strokes={round.strokes}
      />
      <NineHoles
        holes={back9}
        pars={course.pars}
        strokes={round.strokes}
      />
    </div>
  );
}

function NineHoles({
  holes,
  pars,
  strokes,
}: {
  holes: { start: number; end: number; label: string };
  pars: number[];
  strokes: (number | null)[];
}) {
  const holePars = pars.slice(holes.start, holes.end);
  const holeStrokes = strokes.slice(holes.start, holes.end);
  const totalPar = holePars.reduce((a, b) => a + b, 0);
  const playedStrokes = holeStrokes.filter((stroke) => stroke !== null) as number[];
  const totalStrokes =
    playedStrokes.length > 0 ? playedStrokes.reduce((a, b) => a + b, 0) : null;

  return (
    <table className="w-full text-xs tabular-nums">
      <thead>
        <tr className="text-gray-400">
          <th className="w-8 py-1 text-left font-medium">Hole</th>
          {holePars.map((_, i) => (
            <th key={i} className="py-1 text-center font-medium w-7">
              {holes.start + i + 1}
            </th>
          ))}
          <th className="py-1 text-center font-medium w-9 border-l border-gray-100">
            {holes.label}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-gray-400">
          <td className="py-1 text-left font-medium">Par</td>
          {holePars.map((par, i) => (
            <td key={i} className="py-1 text-center">
              {par}
            </td>
          ))}
          <td className="py-1 text-center border-l border-gray-100">
            {totalPar}
          </td>
        </tr>
        <tr>
          <td className="py-1 text-left font-medium text-gray-500">Score</td>
          {holeStrokes.map((stroke, i) => (
            <td key={i} className="py-1 text-center">
              {stroke !== null ? (
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold ${holeScoreClass(stroke, holePars[i])}`}
                >
                  {stroke}
                </span>
              ) : (
                <span className="text-gray-300">–</span>
              )}
            </td>
          ))}
          <td className="py-1 text-center font-semibold border-l border-gray-100">
            {totalStrokes ?? "–"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
