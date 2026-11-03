'use client';

import { useSyncExternalStore } from 'react';
import { Clock, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  dueDate: string; // ISO 8601
}

// Tính số ngày còn lại hoặc đã quá hạn theo ngày để tránh lệch múi giờ
function getDaysDiff(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((dueDay.getTime() - nowDay.getTime()) / (1000 * 60 * 60 * 24));
}

// Đăng ký timer để cập nhật mỗi phút
function subscribe(callback: () => void) {
  const timer = setInterval(callback, 60_000);
  return () => clearInterval(timer);
}

export default function Countdown({ dueDate }: Props) {
  // Tránh hydration mismatch: server snapshot = false, client snapshot = true
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  // Trước khi mount ở client: hiển thị placeholder an toàn
  if (!isClient) {
    return (
      <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-400 px-4 py-2.5 rounded-xl text-sm font-medium">
        <Clock className="w-4 h-4 animate-spin" />
        <span>Đang tính thời gian...</span>
      </div>
    );
  }

  const days = getDaysDiff(dueDate);

  if (days === 0) {
    return (
      <div className="inline-flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-base sm:text-lg px-4 py-2.5 rounded-xl shadow-xs animate-pulse">
        <Flame className="w-5 h-5 text-rose-600" />
        <span>Hôm nay là hạn chót nộp bài!</span>
      </div>
    );
  }

  if (days < 0) {
    return (
      <div className="inline-flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-base sm:text-lg px-4 py-2.5 rounded-xl shadow-xs">
        <AlertCircle className="w-5 h-5 text-rose-600" />
        <span>Đã quá hạn {Math.abs(days)} ngày</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 font-bold text-base sm:text-lg px-4 py-2.5 rounded-xl border shadow-xs ${
        days <= 2
          ? 'bg-rose-50 border-rose-200 text-rose-700'
          : days <= 5
          ? 'bg-amber-50 border-amber-200 text-amber-700'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
      }`}
    >
      {days <= 2 ? (
        <Flame className="w-5 h-5 text-rose-600" />
      ) : days <= 5 ? (
        <Clock className="w-5 h-5 text-amber-600" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      )}
      <span>Còn {days} ngày nữa</span>
    </div>
  );
}
