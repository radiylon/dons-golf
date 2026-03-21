"use client";

import { useState, useEffect } from "react";
import { POLL_INTERVAL_MS } from "@/lib/constants";
import { formatTimeAgo } from "@/lib/format";

export default function LastUpdated({
  timestamp,
  isFetching,
}: {
  timestamp: number;
  isFetching: boolean;
}) {
  const [, setTick] = useState(0);

  const shouldTick = timestamp > 0 && !isFetching;

  useEffect(() => {
    if (!shouldTick) return;
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, [shouldTick]);

  const refreshSeconds = POLL_INTERVAL_MS / 1000;

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
      {isFetching ? (
        <>
          <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
          <span>Updating...</span>
        </>
      ) : timestamp > 0 ? (
        <>
          <span>Updated {formatTimeAgo(timestamp)}</span>
          <span className="text-gray-300">·</span>
          <span>Auto-refreshes every {refreshSeconds}s</span>
        </>
      ) : null}
    </div>
  );
}
