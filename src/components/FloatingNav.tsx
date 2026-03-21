"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTournaments } from "@/lib/hooks";
import { fetchTeamLeaderboard, fetchPlayerLeaderboard } from "@/lib/api";
import { getActiveTournament } from "@/lib/tournaments";

const items = [
  { key: "home", href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    key: "live",
    href: "",
    label: "Live",
    match: (p: string) => p.startsWith("/tournament/"),
  },
  {
    key: "roro",
    href: "/roro",
    label: "RoRo",
    match: (p: string) => p === "/roro",
  },
] as const;

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-4.5 h-4.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function LiveIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-4.5 h-4.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
      />
    </svg>
  );
}

function RoroIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-4.5 h-4.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

const icons: Record<string, (props: { active: boolean }) => React.ReactNode> = {
  home: HomeIcon,
  live: LiveIcon,
  roro: RoroIcon,
};

export default function FloatingNav() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data } = useTournaments();
  const tournaments = data?.results ?? [];
  const activeTournamentId = getActiveTournament(tournaments)?.id ?? null;

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  // Prefetch leaderboard data so navigating to Live is instant
  useEffect(() => {
    if (!activeTournamentId) return;
    queryClient.prefetchQuery({
      queryKey: ["team-leaderboard", activeTournamentId],
      queryFn: () => fetchTeamLeaderboard(activeTournamentId),
      staleTime: 30_000,
    });
    queryClient.prefetchQuery({
      queryKey: ["player-leaderboard", activeTournamentId],
      queryFn: () => fetchPlayerLeaderboard(activeTournamentId),
      staleTime: 30_000,
    });
  }, [activeTournamentId, queryClient]);

  useEffect(() => {
    const activeKey = items.find((item) => {
      if (item.key === "live" && !activeTournamentId) return false;
      return item.match(pathname);
    })?.key;

    if (!activeKey) { setPill(null); return; }
    const el = itemRefs.current[activeKey];
    if (!el) { setPill(null); return; }

    setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [pathname, activeTournamentId]);

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg px-2 py-1.5" style={{ bottom: "calc(12px + env(safe-area-inset-bottom, 12px))" }}>
      {/* Sliding pill indicator */}
      <div
        className={`absolute rounded-full bg-usf-green transition-all duration-75 ${pill ? "opacity-100" : "opacity-0"}`}
        style={pill ? { left: pill.left, width: pill.width, top: 6, bottom: 6 } : undefined}
      />
      {items.map((item) => {
        const isHidden = item.key === "live" && !activeTournamentId;
        const href =
          item.key === "live" && activeTournamentId
            ? `/tournament/${activeTournamentId}`
            : item.href;
        const active = item.match(pathname);
        const Icon = icons[item.key];

        return (
          <Link
            key={item.key}
            ref={(el) => { itemRefs.current[item.key] = el; }}
            href={isHidden ? "#" : href}
            aria-hidden={isHidden || undefined}
            tabIndex={isHidden ? -1 : undefined}
            className={`relative z-10 flex items-center gap-1.5 rounded-full ${
              isHidden
                ? "opacity-0 w-0 overflow-hidden px-0 py-2 pointer-events-none"
                : "px-4 py-2"
            } ${
              active
                ? "text-white"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Icon active={active} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
