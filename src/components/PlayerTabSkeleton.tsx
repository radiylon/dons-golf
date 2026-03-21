export default function PlayerTabSkeleton() {
  return (
    <div className="mx-4 space-y-3 animate-pulse">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-b border-gray-50">
            <div className="w-6 h-4 bg-gray-200 rounded shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-gray-200 rounded w-28" />
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
            <div className="h-4 w-10 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
