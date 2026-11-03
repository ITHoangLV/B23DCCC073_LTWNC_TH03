import Link from 'next/link';
import { getSubjects, getSubjectBySlug, getDeadlines } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { 
  Home, 
  ChevronRight, 
  BookOpen, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Layers
} from 'lucide-react';

// SSG: pre-render tất cả slug khi build
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((s) => ({ slug: s.slug }));
}

// slug không có trong generateStaticParams -> 404
export const dynamicParams = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) return {};
  return {
    title: subject.name,
    description: subject.description,
    openGraph: { title: subject.name, description: subject.description },
  };
}

export default async function SubjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [subject, allDeadlines] = await Promise.all([
    getSubjectBySlug(slug),
    getDeadlines(),
  ]);

  if (!subject) notFound();

  const deadlines = allDeadlines.filter((d) => d.subjectId === subject.id);
  const now = new Date();

  return (
    <div className="bg-mesh-gradient min-h-[calc(100vh-140px)] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-slate-500 mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/subjects" className="hover:text-brand-600 transition-colors">
            Môn học
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{subject.name}</span>
        </nav>

        {/* Subject Overview Card */}
        <div className="subject-detail-panel bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>THÔNG TIN MÔN HỌC</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {subject.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-5">
            <User className="w-4 h-4" />
            <span>Giảng viên: {subject.teacher}</span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {subject.description}
          </p>
        </div>

        {/* Deadlines Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              <span>Danh sách Deadline ({deadlines.length})</span>
            </h2>
            <Link
              href="/deadlines"
              className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              <span>Xem tất cả môn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {deadlines.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center shadow-xs text-slate-500">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Chưa có deadline nào cho môn này</p>
              <p className="text-xs text-slate-500 mt-1">Khi lớp trưởng thêm bài tập mới, thông tin sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deadlines.map((deadline) => {
                const due = new Date(deadline.dueDate);
                const isPast = due < now;
                const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <Link
                    key={deadline.id}
                    href={`/deadlines/${deadline.id}`}
                    className={`card-hover group block p-5 rounded-2xl border bg-white shadow-xs transition-all ${
                      isPast
                        ? 'border-slate-200/80 hover:border-slate-300'
                        : daysLeft <= 2
                        ? 'border-rose-200/80 hover:border-rose-300'
                        : 'border-slate-200/80 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base mb-1">
                          {deadline.title}
                        </h3>
                        {deadline.description && (
                          <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                            {deadline.description}
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {due.toLocaleDateString('vi-VN')}
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isPast
                            ? 'bg-slate-100 text-slate-600'
                            : daysLeft <= 2
                            ? 'bg-rose-50 text-rose-700'
                            : daysLeft <= 5
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {isPast ? `Quá hạn ${Math.abs(daysLeft)} ngày` : `Còn ${daysLeft} ngày`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
