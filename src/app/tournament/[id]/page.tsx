"use client";

import { useParams } from "next/navigation";
import Scoreboard from "@/components/Scoreboard";

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="min-h-screen pb-8">
      <Scoreboard tournamentId={id} />
    </main>
  );
}
