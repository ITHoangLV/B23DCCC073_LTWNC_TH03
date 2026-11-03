'use client';

import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5 border border-amber-100">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
          HỆ THỐNG GẶP SỰ CỐ
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Đã xảy ra lỗi
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          {error.message || 'Hệ thống vừa gặp phải lỗi không mong muốn. Bạn có thể thử tải lại trang hoặc quay về trang chủ.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-slate-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
