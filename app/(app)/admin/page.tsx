// Admin - SSR + phòng thủ nhiều lớp
export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects } from '@/lib/db';
import AddDeadlineForm from '@/components/AddDeadlineForm';
import DeleteDeadlineButton from '@/components/DeleteDeadlineButton';
import type { Metadata } from 'next';
import { ShieldCheck, PlusCircle, ListTodo, Calendar, BookOpen, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quản lý Deadline',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Lớp 2: trang tự kiểm tra quyền (lớp 1 là middleware)
  const session = await auth();
  if (!session?.user) redirect('/login');

  const role = session.user.role;
  // Dùng can() chứ không check role trực tiếp
  if (!can(role, 'deadline:create')) redirect('/403');

  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);

  return (
    <div className="admin-page max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>KHU VỰC QUẢN TRỊ VIÊN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Quản lý Deadline Lớp học
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đăng thêm bài tập mới hoặc xóa hạn nộp đã kết thúc để giữ thông tin của lớp luôn chính xác.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Form thêm deadline */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Thêm Deadline Mới</h2>
              <p className="text-xs text-slate-500">Thông báo đến toàn bộ sinh viên</p>
            </div>
          </div>
          <AddDeadlineForm subjects={subjects} />
        </div>

        {/* Danh sách deadline hiện tại */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-brand-600" />
              <span>Danh sách hiện có ({deadlines.length})</span>
            </h2>
            <span className="text-xs text-slate-500">
              Cập nhật tức thì sau khi thêm/xóa
            </span>
          </div>

          <div className="space-y-3">
            {deadlines.map((deadline) => {
              const subject = subjects.find((s) => s.id === deadline.subjectId);
              const due = new Date(deadline.dueDate);
              const isPast = due < new Date();

              return (
                <div
                  key={deadline.id}
                  className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between gap-4 transition-all hover:border-slate-300"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                        <BookOpen className="w-3 h-3" />
                        {subject?.name}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900 text-sm line-clamp-2">
                      {deadline.title}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Hạn: {due.toLocaleDateString('vi-VN')} {due.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isPast && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          Đã qua
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút xóa với xác nhận */}
                  <div className="shrink-0">
                    <DeleteDeadlineButton deadlineId={deadline.id} title={deadline.title} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
