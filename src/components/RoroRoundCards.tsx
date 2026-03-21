import { formatScore, scoreColor, nineHoleTotal } from "@/lib/format";
import type { PlayerResult, Course } from "@/lib/types";

export default function RoroRoundCards({
  roro,
  courses,
}: {
  roro: PlayerResult;
  courses: Course[];
}) {
  return (
    <div className="flex gap-2 mb-4">
      {courses.map((_, i) => {
        const round = roro.rounds[i];
        const strokes = roro.strokes[i];
        const score = roro.scores?.[i];
        const roundIsLive = round?.status === "in_progress";
        const hasRoundScores = strokes > 0;
        const front = round
          ? nineHoleTotal(round.strokes, 0, 9)
          : null;
        const back = round
          ? nineHoleTotal(round.strokes, 9, 18)
          : null;

        return (
          <div
            key={i}
            className="flex-1 rounded-xl border border-gray-200 bg-white p-3 min-w-0"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold text-gray-900">
                R{i + 1}
              </span>
              {roundIsLive && (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            {hasRoundScores ? (
              <>
                <p
                  className={`text-lg font-bold tabular-nums ${
                    score != null ? scoreColor(score) : "text-gray-600"
                  }`}
                >
                  {score != null ? formatScore(score) : strokes}
                </p>
                <p className="text-[11px] text-gray-400 tabular-nums mt-0.5">
                  {strokes} strokes
                </p>
                {(front !== null || back !== null) && (
                  <p className="text-[11px] text-gray-400 tabular-nums">
                    {front ?? "–"} / {back ?? "–"}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-gray-300">–</p>
                <p className="text-[11px] text-gray-300 tabular-nums mt-0.5">– strokes</p>
                <p className="text-[11px] text-gray-300 tabular-nums">– / –</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
