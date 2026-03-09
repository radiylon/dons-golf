import TournamentList from "@/components/TournamentList";

export default function Home() {
  return (
    <main className="min-h-screen pb-8">
      <header className="bg-usf-green px-4 pt-12 pb-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-xl font-bold">USF Dons Golf</h1>
          <p className="text-usf-gold text-sm font-medium mt-0.5">
            Women&apos;s Golf Schedule &amp; Results
          </p>
        </div>
      </header>

      <div className="max-w-lg mx-auto pt-4">
        <TournamentList />
      </div>
    </main>
  );
}
