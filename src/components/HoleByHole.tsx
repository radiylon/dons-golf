import type { PlayerRound, Course } from "@/lib/types";
import NineHoles from "./NineHoles";

export default function HoleByHole({
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
      <NineHoles holes={front9} pars={course.pars} strokes={round.strokes} yards={course.yards} />
      <NineHoles holes={back9} pars={course.pars} strokes={round.strokes} yards={course.yards} />
    </div>
  );
}
