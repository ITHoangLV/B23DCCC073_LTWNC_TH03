// Chiến lược ISR on-demand:
// - generateStaticParams: pre-render các id hiện có khi build
// - dynamicParams = true: id mới được render lần đầu request rồi cache
// - revalidate 3600: fallback revalidation nếu on-demand không trigger
// - Khi admin thêm/xóa: Server Action gọi revalidatePath cụ thể
export const revalidate = 3600;
export const dynamicParams = true;

import Link from 'next/link';
import { getDeadlines, getDeadlineById, getSubjects } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Countdown from '@/components/Countdown';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Home, 
  LogIn, 
  User,
  CalendarDays
} from 'lucide-react';

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({ id: d.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  if (!deadline) return {};

  const subjects = await getSubjects();
  const subject = subjects.find((s) => s.id === deadline.subjectId);
  const dueDate = new Date(deadline.dueDate).toLocaleDateString('vi-VN');

  return {
    title: deadline.title,
    description: `${subject?.name} • Hạn nộp: ${dueDate} — ${deadline.description}`,
    openGraph: {
      title: deadline.title,
      description: `${subject?.name} • Hạn nộp: ${dueDate}`,
      images: [{ url: `/deadlines/${id}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: deadline.title,
      description: `${subject?.name} • Hạn nộp: ${dueDate}`,
      images: [`/deadlines/${id}/opengraph-image`],
    },
    alternates: {
      canonical: `/deadlines/${id}`,
    },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const { id } = await params;
  const [deadline, subjects] = await Promise.all([
    getDeadlineById(id),
    getSubjects(),
  ]);

  if (!deadline) notFound();

  const subject = subjects.find((s) => s.id === deadline.subjectId);
  const dueDate = new Date(deadline.dueDate);
  const createdAt = new Date(deadline.createdAt);
  const isPast = dueDate < new Date();

  // JSON-LD BreadcrumbList cho SEO
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000' },
      { '@type': 'ListItem', position: 2, name: 'Deadline', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/deadlines` },
      { '@type': 'ListItem', position: 3, name: deadline.title, item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/deadlines/${id}` },
    ],
  };

  return (
    <div className="bg-mesh-gradient min-h-[calc(100vh-140px)] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* JSON-LD - escape < để tránh XSS */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
          }}
        />

        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-slate-500 mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/deadlines" className="hover:text-brand-600 transition-colors">
            Deadline
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {deadline.title}
          </span>
        </nav>

        {/* Main Card */}
        <article className="detail-reference-panel bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          {/* Card Header */}
          <div className={`p-6 sm:p-10 border-b border-slate-100 ${
            isPast 
              ? 'bg-slate-50/70' 
              : 'bg-gradient-to-br from-brand-50/70 via-white to-slate-50/50'
          }`}>
            {subject && (
              <div className="mb-4">
                <Link
                  href={`/subjects/${subject.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-white border border-brand-200/80 px-3 py-1.5 rounded-full hover:bg-brand-50 transition-colors shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                  <span>{subject.name}</span>
                </Link>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              {deadline.title}
            </h1>

            {/* Countdown Banner */}
            <Countdown dueDate={deadline.dueDate} />
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Description */}
            {deadline.description && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Nội dung & Yêu cầu
                </h2>
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {deadline.description}
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Thông tin chi tiết
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <CalendarDays className="w-4 h-4 text-brand-500" />
                    <span>Hạn nộp chính xác</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {dueDate.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-brand-600 font-semibold mt-0.5">
                    {dueDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Ngày đăng thông báo</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {createdAt.toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Học kỳ 2 (2025-2026)</div>
                </div>

                {subject?.teacher && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <User className="w-4 h-4 text-emerald-500" />
                      <span>Giảng viên phụ trách</span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{subject.teacher}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Khoa CNTT 1 • PTIT</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-6 sm:px-10 py-5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/deadlines"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại danh sách deadline</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-xs shadow-brand-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Vào Dashboard để đánh dấu</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
