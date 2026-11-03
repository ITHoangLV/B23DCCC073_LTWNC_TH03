// Dashboard - SSR: cần session user cụ thể, không thể cache
export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects, getCompletions } from '@/lib/db';
import ToggleCompleteButton from '@/components/ToggleCompleteButton';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  TrendingUp,
  ExternalLink,
  Flame
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  // Lớp 2 kiểm tra quyền (lớp 1 là middleware)
  const session = await auth();
  if (!session?.user) redirect('/login');

  const role = session.user.role;
  if (!can(role, 'deadline:view')) redirect('/403');

  const userId = session.user.id;

  const [deadlines, subjects, completions] = await Promise.all([
    getDeadlines(),
    getSubjects(),
    getCompletions(userId),
  ]);

  const completedIds = new Set(completions.map((c) => c.deadlineId));
  const now = new Date();
  const upcoming = deadlines.filter((d) => new Date(d.dueDate) >= now);
  const overdue = deadlines.filter((d) => new Date(d.dueDate) < now);
  const completedCount = deadlines.filter((d) => completedIds.has(d.id)).length;
  const progress = deadlines.length > 0 ? Math.round((completedCount / deadlines.length) * 100) : 0;

  const todayStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(now);

  return (
    <div className="space-y-8">
      {/* Welcome Banner Card */}
      <div className="dashboard-reference-banner p-6 sm:p-8">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>{todayStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Xin chào, {session.user.name}!
          </h1>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            Mỗi bài tập hoàn thành hôm nay là một bước tiến vững chắc cho kỳ học của bạn. Hãy kiên trì nhé!
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="dashboard-stat-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{deadlines.length}</div>
            <div className="text-xs font-medium text-slate-500">Tổng deadline</div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{completedCount}</div>
            <div className="text-xs font-medium text-slate-500">Đã hoàn thành</div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{upcoming.length}</div>
            <div className="text-xs font-medium text-slate-500">Sắp tới hạn</div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600">{overdue.length}</div>
            <div className="text-xs font-medium text-slate-500">Đã quá hạn</div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-base">Tiến độ hoàn thành của bạn</h2>
          </div>
          <span className="text-2xl font-bold text-brand-600">{progress}%</span>
        </div>

        {/* Progress bar with smooth animation */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-brand-600 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Tiến độ: ${progress}%`}
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between mt-3 text-xs text-slate-500">
          <span>
            Đã hoàn thành <strong className="text-slate-700">{completedCount}</strong> trên tổng số <strong className="text-slate-700">{deadlines.length}</strong> deadline
          </span>
          <span className="font-medium text-brand-600">
            {progress === 100
              ? '🎉 Xuất sắc! Bạn đã xong hết!'
              : progress >= 50
              ? '💪 Đã đi được hơn nửa chặng đường!'
              : '🚀 Cố gắng lên nhé!'}
          </span>
        </div>
      </div>

      {/* Deadlines Task List */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            <span>Nhiệm vụ & Hạn nộp</span>
          </h2>
          <span className="text-xs text-slate-500">
            Bấm nút để đánh dấu hoàn thành bài tập
          </span>
        </div>

        <div className="space-y-3">
          {deadlines.map((deadline) => {
            const subject = subjects.find((s) => s.id === deadline.subjectId);
            const due = new Date(deadline.dueDate);
            const isPast = due < now;
            const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const isCompleted = completedIds.has(deadline.id);

            return (
              <div
                key={deadline.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/70 shadow-2xs'
                    : isPast
                    ? 'bg-slate-50/60 border-slate-200/80 shadow-2xs'
                    : daysLeft <= 2
                    ? 'bg-rose-50/30 border-rose-200/70 shadow-2xs'
                    : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                {/* Left: Check Button & Title */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className="shrink-0 mt-0.5 sm:mt-0">
                    <ToggleCompleteButton
                      deadlineId={deadline.id}
                      initialCompleted={isCompleted}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                        <BookOpen className="w-3 h-3" />
                        {subject?.name}
                      </span>
                    </div>

                    <Link
                      href={`/deadlines/${deadline.id}`}
                      className={`font-semibold text-sm block line-clamp-2 hover:text-brand-600 transition-colors ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {deadline.title}
                    </Link>
                  </div>
                </div>

                {/* Right: Due Date & Status */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {due.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isPast
                        ? 'bg-slate-200 text-slate-600'
                        : daysLeft === 0
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : daysLeft <= 2
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : daysLeft <= 5
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isCompleted
                      ? '✓ Đã xong'
                      : isPast
                      ? `Quá hạn ${Math.abs(daysLeft)} ngày`
                      : daysLeft === 0
                      ? 'Hôm nay!'
                      : `Còn ${daysLeft} ngày`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
