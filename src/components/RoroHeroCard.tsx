import { RORO_PLAYER_NAME, playerPhotoUrl } from "@/lib/constants";
import { formatScore, ordinal } from "@/lib/format";
import type { PlayerResult } from "@/lib/types";

export default function RoroHeroCard({
  roro,
  hasScores,
  playerIsLive,
  rankInfo,
}: {
  roro: PlayerResult | null;
  hasScores: boolean;
  playerIsLive: boolean;
  rankInfo: { rank: number; total: number; isTied: boolean } | null;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div className="p-5 flex items-center gap-4">
        {roro?.userPicture ? (
          <img
            src={playerPhotoUrl(roro.userPicture, 160)}
            alt={RORO_PLAYER_NAME}
            className="w-24 h-24 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-usf-green/10 shrink-0 flex items-center justify-center text-usf-green text-2xl font-bold">
            RM
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-bold text-lg text-gray-900">
            {RORO_PLAYER_NAME}
          </h2>
          {playerIsLive && roro && (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Live
              </span>
              {roro.holeThrough && (
                <span className="text-xs text-gray-400">
                  Thru {roro.holeThrough}
                </span>
              )}
            </div>
          )}
          {!roro && (
            <p className="text-xs text-gray-400 mt-1.5">
              Not competing in this tournament
            </p>
          )}
          {roro && !hasScores && !playerIsLive && (
            <p className="text-xs text-gray-400 mt-1.5">No scores yet</p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-usf-green grid grid-cols-3 divide-x divide-white/20">
        <div className="py-3 text-center">
          <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">
            Score
          </p>
          <p
            className={`text-xl font-bold tabular-nums mt-0.5 ${
              hasScores ? "text-white" : "text-white/40"
            }`}
          >
            {hasScores ? formatScore(roro!.totalScore) : "–"}
          </p>
        </div>
        <div className="py-3 text-center">
          <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">
            Strokes
          </p>
          <p
            className={`text-xl font-bold tabular-nums mt-0.5 ${
              hasScores ? "text-white" : "text-white/40"
            }`}
          >
            {hasScores ? roro!.totalStrokes : "–"}
          </p>
        </div>
        <div className="py-3 text-center">
          <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">
            Position
          </p>
          <p
            className={`text-xl font-bold tabular-nums mt-0.5 ${
              rankInfo ? "text-white" : "text-white/40"
            }`}
          >
            {rankInfo ? (
              <>
                {rankInfo.isTied ? "T" : ""}
                {ordinal(rankInfo.rank)}
                <span className="font-normal text-white/50">
                  {" "}of {rankInfo.total}
                </span>
              </>
            ) : (
              "–"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
