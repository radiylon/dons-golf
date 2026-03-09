import { NextResponse } from "next/server";
import { CLIPPD_API, SF_SCHOOL_ID } from "@/lib/constants";

export async function GET() {
  try {
    const res = await fetch(
      `${CLIPPD_API}/tournaments?schoolId=${SF_SCHOOL_ID}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 },
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
