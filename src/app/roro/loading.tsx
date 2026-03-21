export default function RoroLoading() {
  return (
    <main className="min-h-screen pb-8">
      <div className="bg-usf-green pt-12 pb-4 px-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full" />
          <div className="h-5 bg-white/20 rounded w-36" />
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-2 space-y-4 animate-pulse">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-5 flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-36" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
          </div>
          <div className="bg-usf-green/20 h-16" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 rounded-xl border border-gray-200 p-3 w-[120px] h-24 bg-white" />
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl h-48" />
      </div>
    </main>
  );
}
