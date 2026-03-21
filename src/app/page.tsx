import TournamentList from "@/components/TournamentList";
import PageHeader from "@/components/PageHeader";

export default function Home() {
  return (
    <main className="min-h-screen pb-8">
      <PageHeader
        title="USF Dons Golf"
        subtitle="Women's Golf Schedule & Results"
      />

      <div className="max-w-lg mx-auto pt-4">
        <TournamentList />
      </div>
    </main>
  );
}
