'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  LucideIcon,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/deadlines', label: 'Deadlines', icon: Calendar },
  { href: '/subjects', label: 'Môn học', icon: BookOpen },
];

const adminItems: NavItem[] = [
  { href: '/admin', label: 'Quản lý deadline', icon: ShieldCheck },
];

interface Props {
  isAdmin?: boolean;
}

export default function SidebarNav({ isAdmin = false }: Props) {
  const pathname = usePathname();

  const renderItem = (item: NavItem) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    const Icon = item.icon;
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
            isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'
          }`} />
          <span>{item.label}</span>
        </div>
        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
          isActive ? 'text-brand-200' : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
        }`} />
      </Link>
    );
  };

  return (
    <nav className="space-y-1.5" aria-label="Navigation">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
        Menu chính
      </div>
      {navItems.map(renderItem)}
      {isAdmin && (
        <div className="pt-4 mt-4 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quản trị viên</span>
          </div>
          {adminItems.map(renderItem)}
        </div>
      )}
    </nav>
  );
}
