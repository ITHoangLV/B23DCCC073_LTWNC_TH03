export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome banner skeleton */}
      <div className="h-40 rounded-2xl bg-slate-200/70" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 min-w-0 bg-white border border-slate-200/70 rounded-2xl p-4 flex items-center gap-3">
            <div className="hidden sm:block w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-12 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress skeleton */}
      <div className="h-32 bg-white border border-slate-200/70 rounded-2xl p-6" />

      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-white border border-slate-200/70 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
