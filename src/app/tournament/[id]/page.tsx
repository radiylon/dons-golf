import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Scoreboard from "@/components/Scoreboard";
import {
  fetchTeamLeaderboardServer,
  fetchPlayerLeaderboardServer,
} from "@/lib/api";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  // Only prefetch team + player data (fast, 1 call each).
  // Tournaments list loads client-side — it's only used for the name/date
  // and would otherwise gate the page behind 6 Clippd API calls.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["team-leaderboard", id],
      queryFn: () => fetchTeamLeaderboardServer(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["player-leaderboard", id],
      queryFn: () => fetchPlayerLeaderboardServer(id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen pb-8">
        <Scoreboard tournamentId={id} />
      </main>
    </HydrationBoundary>
  );
}
