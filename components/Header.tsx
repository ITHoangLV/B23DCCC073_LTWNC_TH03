import Link from 'next/link';
import { auth } from '@/auth';
import { signOut } from '@/auth';
import type { Role } from '@/lib/permissions';

const ROLE_LABELS: Record<Exclude<Role, 'guest'>, string> = {
  admin: 'Lớp trưởng',
  user: 'Sinh viên',
};

const ROLE_COLORS: Record<Exclude<Role, 'guest'>, string> = {
  admin: 'bg-red-100 text-red-700',
  user: 'bg-blue-100 text-blue-700',
};

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <span aria-hidden="true">📅</span>
          <span>Deadline Hub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/deadlines" className="hover:text-blue-600 transition-colors">Deadlines</Link>
          <Link href="/subjects" className="hover:text-blue-600 transition-colors">Môn học</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-700 font-medium">{user.name}</span>
              {user.role && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[user.role as Exclude<Role, 'guest'>]}`}>
                  {ROLE_LABELS[user.role as Exclude<Role, 'guest'>]}
                </span>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Quản lý
                </Link>
              )}
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}>
                <button
                  type="submit"
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Đăng xuất
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
