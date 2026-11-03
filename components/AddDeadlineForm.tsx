'use client';

import { useActionState } from 'react';
import { addDeadlineAction, type AddDeadlineState } from '@/actions/deadline-actions';
import type { Subject } from '@/lib/types';
import { Plus, Loader2, CheckCircle2, AlertCircle, Calendar, BookOpen, FileText } from 'lucide-react';

interface Props {
  subjects: Subject[];
}

const initialState: AddDeadlineState = {};

export default function AddDeadlineForm({ subjects }: Props) {
  const [state, formAction, isPending] = useActionState(addDeadlineAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Alert Messages */}
      {state.success && (
        <div role="alert" className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã thêm deadline thành công! Danh sách đã được cập nhật.</span>
        </div>
      )}
      {state.errors?._form && (
        <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{state.errors._form[0]}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Tiêu đề deadline <span className="text-rose-500" aria-label="bắt buộc">*</span>
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={3}
            maxLength={120}
            placeholder="VD: Nộp báo cáo giữa kỳ môn Web..."
            className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
              state.errors?.title ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-brand-500'
            }`}
            aria-describedby={state.errors?.title ? 'title-error' : undefined}
          />
        </div>
        {state.errors?.title && (
          <p id="title-error" className="text-xs text-rose-500 mt-1">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subjectId" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Môn học liên quan <span className="text-rose-500" aria-label="bắt buộc">*</span>
        </label>
        <div className="relative">
          <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <select
            id="subjectId"
            name="subjectId"
            required
            className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none transition-all cursor-pointer ${
              state.errors?.subjectId ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-brand-500'
            }`}
            aria-describedby={state.errors?.subjectId ? 'subject-error' : undefined}
          >
            <option value="">-- Chọn môn học --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {state.errors?.subjectId && (
          <p id="subject-error" className="text-xs text-rose-500 mt-1">{state.errors.subjectId[0]}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Hạn nộp chính xác <span className="text-rose-500" aria-label="bắt buộc">*</span>
        </label>
        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            required
            className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
              state.errors?.dueDate ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-brand-500'
            }`}
            aria-describedby={state.errors?.dueDate ? 'due-error' : undefined}
          />
        </div>
        {state.errors?.dueDate && (
          <p id="due-error" className="text-xs text-rose-500 mt-1">{state.errors.dueDate[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Ghi chú & Yêu cầu đề bài
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={1000}
          placeholder="Mô tả chi tiết yêu cầu, link nộp bài (form Google, portal PTIT, Teams)..."
          className={`w-full p-3.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none transition-all ${
            state.errors?.description ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-brand-500'
          }`}
          aria-describedby={state.errors?.description ? 'desc-error' : undefined}
        />
        {state.errors?.description && (
          <p id="desc-error" className="text-xs text-rose-500 mt-1">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-xs shadow-brand-600/25 hover:shadow-md hover:shadow-brand-600/30 transition-all text-sm cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang lưu deadline...</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Thêm Deadline cho lớp</span>
          </>
        )}
      </button>
    </form>
  );
}
