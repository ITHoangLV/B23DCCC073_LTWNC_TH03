import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: '403 - Không có quyền truy cập',
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="bg-mesh-gradient min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
          LỖI TRUY CẬP 403
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Khu vực giới hạn quyền
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          Trang bạn yêu cầu chỉ dành riêng cho tài khoản Lớp trưởng. Nếu bạn là sinh viên, vui lòng quay lại không gian học tập của mình.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Về Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-slate-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
