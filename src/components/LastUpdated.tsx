"use client";

import { useState, useEffect } from "react";
import { POLL_INTERVAL_MS } from "@/lib/constants";

function formatTimeAgo(timestamp: number): string {
  if (timestamp === 0) return "";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

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
