import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Scoreboard from "@/components/Scoreboard";
import { fetchTeamLeaderboardServer } from "@/lib/api";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  // Only prefetch team data on the server (shown on the default tab).
  // Player data loads eagerly client-side without blocking initial render.
  await queryClient.prefetchQuery({
    queryKey: ["team-leaderboard", id],
    queryFn: () => fetchTeamLeaderboardServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen pb-8">
        <Scoreboard tournamentId={id} />
      </main>
    </HydrationBoundary>
  );
}
