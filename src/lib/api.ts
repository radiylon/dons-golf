import { CLIPPD_API, SF_SCHOOL_ID, SEASONS } from "./constants";
import type { TeamLeaderboard, PlayerLeaderboard, TournamentList, Tournament } from "./types";

export async function fetchTournaments(): Promise<TournamentList> {
  const res = await fetch("/api/tournaments");
  if (!res.ok) throw new Error("Failed to fetch tournaments");
  return res.json();
}

export async function fetchTeamLeaderboard(tournamentId: string): Promise<TeamLeaderboard> {
  const res = await fetch(`/api/team?tournamentId=${tournamentId}`);
  if (!res.ok) throw new Error("Failed to fetch team leaderboard");
  return res.json();
}

export async function fetchPlayerLeaderboard(tournamentId: string): Promise<PlayerLeaderboard> {
  const res = await fetch(`/api/players?tournamentId=${tournamentId}`);
  if (!res.ok) throw new Error("Failed to fetch player leaderboard");
  return res.json();
}

/** Server-side fetchers — call Clippd directly, skip the /api proxy */

export async function fetchTournamentsServer(): Promise<TournamentList> {
  const firstPages = await Promise.all(
    SEASONS.map((season) =>
      fetch(
        `${CLIPPD_API}/tournaments?schoolId=${SF_SCHOOL_ID}&season=${season}&offset=0`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          next: { revalidate: 300 },
        }
      ).then((r) => (r.ok ? r.json() : { results: [] }))
    )
  );

  const secondPages = await Promise.all(
    firstPages.map((data, i) => {
      if (data.results?.length >= 10) {
        return fetch(
          `${CLIPPD_API}/tournaments?schoolId=${SF_SCHOOL_ID}&season=${SEASONS[i]}&offset=10`,
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 300 },
          }
        ).then((r) => (r.ok ? r.json() : { results: [] }));
      }
      return Promise.resolve({ results: [] });
    })
  );

  const allResults: Tournament[] = [];
  for (let i = 0; i < SEASONS.length; i++) {
    allResults.push(...(firstPages[i].results || []));
    allResults.push(...(secondPages[i].results || []));
  }

  const seen = new Set<string>();
  const uniqueResults = allResults.filter((t) => {
    if (seen.has(t.tournamentId)) return false;
    seen.add(t.tournamentId);
    return true;
  });

  return { results: uniqueResults };
}

export async function fetchTeamLeaderboardServer(tournamentId: string): Promise<TeamLeaderboard> {
  const res = await fetch(
    `${CLIPPD_API}/tournaments/${tournamentId}/leaderboards/team`,
    {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 30 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch team leaderboard");
  return res.json();
}

export async function fetchPlayerLeaderboardServer(tournamentId: string): Promise<PlayerLeaderboard> {
  const res = await fetch(
    `${CLIPPD_API}/tournaments/${tournamentId}/leaderboards/player`,
    {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 30 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch player leaderboard");
  return res.json();
}
