import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchTournamentsServer, fetchPlayerLeaderboardServer } from "@/lib/api";
import { getActiveTournament } from "@/lib/tournaments";
import RoroTracker from "@/components/RoroTracker";

export const metadata: Metadata = {
  title: "RoRo | USF Dons Golf",
};

export default async function RoroPage() {
  const queryClient = new QueryClient();

  const tournamentsData = await queryClient.fetchQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournamentsServer,
  });

  const active = getActiveTournament(tournamentsData.results);

  if (active) {
    await queryClient.prefetchQuery({
      queryKey: ["player-leaderboard", active.id],
      queryFn: () => fetchPlayerLeaderboardServer(active.id),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen pb-8">
        <RoroTracker />
      </main>
    </HydrationBoundary>
  );
}
