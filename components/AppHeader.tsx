import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { auth, signOut } from '@/auth';
import Brand from '@/components/Brand';
import SiteNavigation from '@/components/SiteNavigation';

export default async function AppHeader() {
  const session = await auth();
  const user = session?.user;
  return (
    <header className="reference-header">
      <div className="site-container header-content">
        <Brand />
        <SiteNavigation isAdmin={user?.role === 'admin'} />
        <div className="header-account">
          {user ? <>
            <span className="account-avatar" aria-hidden="true">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
            <div className="account-name"><span>{user.name}</span><small>{user.role === 'admin' ? 'Lớp trưởng' : 'Sinh viên'}</small></div>
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}>
              <button className="logout-button" type="submit" aria-label="Đăng xuất" title="Đăng xuất"><LogOut size={17} aria-hidden="true" /></button>
            </form>
          </> : <Link href="/login" className="button-primary">Đăng nhập</Link>}
        </div>
      </div>
    </header>
  );
}
