import Scoreboard from "@/components/Scoreboard";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen pb-8">
      <Scoreboard tournamentId={id} />
    </main>
  );
}
