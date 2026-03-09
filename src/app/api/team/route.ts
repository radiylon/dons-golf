import { NextRequest, NextResponse } from "next/server";
import { CLIPPD_API } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const tournamentId = request.nextUrl.searchParams.get("tournamentId");

  if (!tournamentId) {
    return NextResponse.json(
      { error: "tournamentId is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${CLIPPD_API}/tournaments/${tournamentId}/leaderboards/team`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Clippd" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
