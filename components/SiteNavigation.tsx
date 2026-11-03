'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteNavigation({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const links = [{ href: '/deadlines', label: 'Deadline' }, { href: '/subjects', label: 'Môn học' }, { href: '/dashboard', label: 'Dashboard' }, ...(isAdmin ? [{ href: '/admin', label: 'Quản trị' }] : [])];
  return <nav className="site-navigation" aria-label="Điều hướng chính">{links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(href + '/') ? 'page' : undefined}>{label}</Link>)}</nav>;
}
