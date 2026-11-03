import SidebarNav from '@/components/SidebarNav';
import { auth } from '@/auth';

// Dashboard layout với sidebar - SSR (có auth())
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';
  const name = session?.user?.name ?? 'Sinh viên';
  const email = session?.user?.email ?? '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs sticky top-24">
            {/* User Mini Profile */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold flex items-center justify-center text-base shadow-sm shadow-brand-500/25">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-sm truncate" title={name}>
                  {name}
                </div>
                <div className="text-xs text-slate-500 truncate" title={email}>
                  {email}
                </div>
              </div>
            </div>
            
            {/* Client Component xử lý active state */}
            <SidebarNav isAdmin={isAdmin} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
