import { NextResponse } from "next/server";
import { CLIPPD_API, SF_SCHOOL_ID, SEASONS } from "@/lib/constants";
import type { Tournament } from "@/lib/types";

export async function GET() {
  try {
    const allResults: Tournament[] = [];

    // Fetch page 1 for all seasons in parallel
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

    // For any season that returned 10 results, fetch page 2
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

    for (let i = 0; i < SEASONS.length; i++) {
      allResults.push(...(firstPages[i].results || []));
      allResults.push(...(secondPages[i].results || []));
    }

    // Deduplicate by tournamentId
    const seen = new Set<string>();
    const uniqueResults = allResults.filter((t) => {
      if (seen.has(t.tournamentId)) return false;
      seen.add(t.tournamentId);
      return true;
    });

    return NextResponse.json({ results: uniqueResults });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
