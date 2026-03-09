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
