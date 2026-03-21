export default function TournamentLoading() {
  return (
    <main className="min-h-screen pb-8">
      <div className="bg-usf-green pt-12 pb-4 px-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full" />
          <div className="h-5 bg-white/20 rounded w-48" />
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4 animate-pulse">
        <div className="bg-usf-green/20 rounded-xl p-4 h-32" />
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <div className="flex-1 h-9 bg-gray-200 rounded-md" />
          <div className="flex-1 h-9 bg-gray-200 rounded-md" />
          <div className="flex-1 h-9 bg-gray-200 rounded-md" />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 border-b border-gray-50">
              <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-200 rounded w-28" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
              <div className="h-4 w-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
