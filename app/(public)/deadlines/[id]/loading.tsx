export default function DeadlineDetailLoading() {
  return (
    <div className="bg-mesh-gradient min-h-[calc(100vh-140px)] py-8 sm:py-12 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-4 w-48 bg-slate-200 rounded" />
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
          <div className="p-8 sm:p-10 bg-slate-50 border-b border-slate-100 space-y-4">
            <div className="h-6 w-32 bg-brand-100 rounded-full" />
            <div className="h-10 w-3/4 bg-slate-200 rounded-xl" />
            <div className="h-12 w-48 bg-slate-200 rounded-xl" />
          </div>
          <div className="p-8 sm:p-10 space-y-6">
            <div className="h-28 bg-slate-100 rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-20 bg-slate-100 rounded-xl" />
              <div className="h-20 bg-slate-100 rounded-xl" />
              <div className="h-20 bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
