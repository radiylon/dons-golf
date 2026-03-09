import type { PlayerRound, Course } from "@/lib/types";

function holeScoreClass(score: number | null, par: number): string {
  if (score === null) return "";
  const diff = score - par;
  if (diff <= -2) return "bg-eagle text-white rounded-full";
  if (diff === -1) return "bg-birdie text-white rounded-full";
  if (diff === 1) return "bg-bogey text-white rounded-full";
  if (diff >= 2) return "bg-double text-white rounded-full";
  return "";
}

export function NineHoles({
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
  const playedStrokes = holeStrokes.filter(
    (stroke) => stroke !== null
  ) as number[];
  const totalStrokes =
    playedStrokes.length > 0
      ? playedStrokes.reduce((a, b) => a + b, 0)
      : null;

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

export function HoleByHole({
  round,
  course,
}: {
  round: PlayerRound | undefined;
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
      <NineHoles holes={front9} pars={course.pars} strokes={round.strokes} />
      <NineHoles holes={back9} pars={course.pars} strokes={round.strokes} />
    </div>
  );
}
