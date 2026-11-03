export default function AdminLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-36 bg-rose-100 rounded-full" />
        <div className="h-9 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full max-w-96 bg-slate-100 rounded" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 h-96 bg-white border border-slate-200/80 rounded-2xl p-6" />
        <div className="lg:col-span-7 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white border border-slate-200/80 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
