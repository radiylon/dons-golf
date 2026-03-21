import { formatScore } from "@/lib/format";
import { ordinal } from "@/lib/format";
import type { TeamResult } from "@/lib/types";

export default function SFSummaryBanner({
  sfTeam,
  sfRankInfo,
  isLive,
}: {
  sfTeam: TeamResult | undefined;
  sfRankInfo: { rank: number; isTied: boolean; total: number };
  isLive: boolean;
}) {
  return (
    <div className="mx-4 mb-4 bg-usf-green rounded-xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-usf-gold text-xs font-medium uppercase tracking-wider">
            San Francisco Dons
          </p>
          <p className="text-3xl font-bold tabular-nums mt-0.5">
            {sfTeam && sfTeam.totalStrokes > 0
              ? formatScore(sfTeam.totalScore)
              : "–"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white text-xs uppercase font-medium tracking-wider">Team Position</p>
          {sfTeam && sfTeam.totalStrokes > 0 && sfRankInfo.rank > 0 ? (
            <p className="text-3xl font-bold tabular-nums mt-0.5">
              {sfRankInfo.isTied ? "T" : ""}
              {ordinal(sfRankInfo.rank)}
              <span className="font-normal text-white/50">
                {" "}of {sfRankInfo.total}
              </span>
            </p>
          ) : (
            <p className="text-3xl font-bold tabular-nums">–</p>
          )}
        </div>
      </div>
      {sfTeam && sfTeam.totalStrokes > 0 && (
        <div className="mt-3 flex gap-3 text-sm">
          {sfTeam.strokes.map((strokes, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-lg px-3 py-1.5 text-center"
            >
              <p className="text-white/50 text-xs">R{i + 1}</p>
              <p className="font-semibold tabular-nums">{strokes > 0 ? strokes : "–"}</p>
            </div>
          ))}
          <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
            <p className="text-white/50 text-xs">Total</p>
            <p className="font-semibold tabular-nums">
              {sfTeam.totalStrokes}
            </p>
          </div>
        </div>
      )}
      {isLive && (
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      )}
    </div>
  );
}
