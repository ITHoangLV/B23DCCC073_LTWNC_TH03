import Link from 'next/link';
import type { Metadata } from 'next';
import { Search, Home, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Không tìm thấy trang',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5 border border-brand-100">
          <Search className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
          LỖI 404
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Không tìm thấy trang
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          Địa chỉ này có thể đã thay đổi hoặc không tồn tại trên hệ thống Class Deadline Hub.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
