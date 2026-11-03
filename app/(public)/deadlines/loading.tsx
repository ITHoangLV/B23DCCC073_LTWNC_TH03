export default function DeadlinesLoading() {
  return (
    <div className="bg-mesh-gradient min-h-[calc(100vh-140px)] py-8 sm:py-12 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <div className="h-6 w-32 bg-brand-100 rounded-full" />
          <div className="h-10 w-72 bg-slate-200 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 rounded" />
        </div>

        <div className="h-28 bg-white border border-slate-200/80 rounded-2xl" />

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-white border border-slate-200/80 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
