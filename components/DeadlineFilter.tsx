'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Deadline, Subject } from '@/lib/types';
import { 
  Search, 
  Calendar, 
  Clock, 
  Filter, 
  ChevronRight, 
  AlertCircle, 
  Flame, 
  CheckCircle2, 
  X,
  BookOpen
} from 'lucide-react';

interface Props {
  deadlines: Deadline[];
  subjects: Subject[];
}

type FilterStatus = 'all' | 'upcoming' | 'overdue';

export default function DeadlineFilter({ deadlines, subjects }: Props) {
  const [search, setSearch] = useState('');
  const [subjectId, setSubjectId] = useState('all');
  const [status, setStatus] = useState<FilterStatus>('all');

  const filtered = useMemo(() => {
    const now = new Date();
    return deadlines.filter((d) => {
      // Lọc theo môn học
      if (subjectId !== 'all' && d.subjectId !== subjectId) return false;

      // Lọc theo trạng thái
      const due = new Date(d.dueDate);
      if (status === 'upcoming' && due < now) return false;
      if (status === 'overdue' && due >= now) return false;

      // Tìm kiếm theo tên
      if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;

      return true;
    });
  }, [deadlines, subjectId, status, search]);

  const now = new Date();

  return (
    <div className="space-y-6">
      {/* Control Bar: Search + Filter Controls */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              placeholder="Tìm kiếm deadline theo tên bài tập..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              aria-label="Tìm kiếm deadline"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject filter select */}
          <div className="relative md:w-64 md:shrink-0">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none transition-all cursor-pointer"
              aria-label="Lọc theo môn học"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status segmented tabs & results counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setStatus('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                status === 'all'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              aria-pressed={status === 'all'}
            >
              Tất cả ({deadlines.length})
            </button>
            <button
              type="button"
              onClick={() => setStatus('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                status === 'upcoming'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              aria-pressed={status === 'upcoming'}
            >
              Sắp tới
            </button>
            <button
              type="button"
              onClick={() => setStatus('overdue')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                status === 'overdue'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              aria-pressed={status === 'overdue'}
            >
              Quá hạn
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Hiển thị <span className="font-semibold text-slate-800">{filtered.length}</span> deadline
          </div>
        </div>
      </div>

      {/* Deadlines List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-3">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Không tìm thấy deadline phù hợp
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn lọc môn học khác để xem danh sách.
          </p>
          {(search || subjectId !== 'all' || status !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSubjectId('all');
                setStatus('all');
              }}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((deadline) => {
            const subject = subjects.find((s) => s.id === deadline.subjectId);
            const due = new Date(deadline.dueDate);
            const isPast = due < now;
            const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Link
                key={deadline.id}
                href={`/deadlines/${deadline.id}`}
                className={`card-hover group block p-5 rounded-2xl border bg-white transition-all shadow-xs ${
                  isPast
                    ? 'border-slate-200/80 hover:border-slate-300'
                    : daysLeft <= 2
                    ? 'border-rose-200/80 hover:border-rose-300 hover:bg-rose-50/20'
                    : daysLeft <= 5
                    ? 'border-amber-200/80 hover:border-amber-300 hover:bg-amber-50/20'
                    : 'border-slate-200/80 hover:border-brand-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                        <BookOpen className="w-3 h-3" />
                        {subject?.name}
                      </span>
                    </div>
                    <h2 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-2 mb-1">
                      {deadline.title}
                    </h2>
                    {deadline.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                        {deadline.description}
                      </p>
                    )}
                  </div>

                  {/* Right: Due Date & Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">
                        {due.toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isPast
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : daysLeft === 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                            : daysLeft <= 2
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : daysLeft <= 5
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isPast ? (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Quá hạn {Math.abs(daysLeft)} ngày
                          </>
                        ) : daysLeft === 0 ? (
                          <>
                            <Flame className="w-3 h-3 text-rose-500" />
                            Hôm nay!
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Còn {daysLeft} ngày
                          </>
                        )}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-600 transition-all hidden sm:block" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
