import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchTournamentsServer } from "@/lib/api";
import TournamentList from "@/components/TournamentList";
import PageHeader from "@/components/PageHeader";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournamentsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen pb-8">
        <PageHeader
          title="USF Dons Golf"
          subtitle="Women's Golf Schedule & Results"
        />

        <div className="max-w-lg mx-auto pt-4">
          <TournamentList />
        </div>
      </main>
    </HydrationBoundary>
  );
}
