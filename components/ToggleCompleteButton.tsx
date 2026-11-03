'use client';

import { useActionState, useTransition } from 'react';
import { toggleCompleteAction } from '@/actions/deadline-actions';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Props {
  deadlineId: string;
  initialCompleted: boolean;
}

export default function ToggleCompleteButton({ deadlineId, initialCompleted }: Props) {
  const [state, formAction] = useActionState(toggleCompleteAction, {
    completed: initialCompleted,
  });
  const [isPending, startTransition] = useTransition();

  const isCompleted = state.completed ?? initialCompleted;

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          formAction(new FormData(e.currentTarget));
        });
      }}
    >
      <input type="hidden" name="deadlineId" value={deadlineId} />
      <button
        type="submit"
        disabled={isPending}
        aria-label={isCompleted ? 'Bỏ đánh dấu đã xong' : 'Đánh dấu đã xong'}
        className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isPending
            ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-400'
            : isCompleted
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
            : 'bg-slate-100/80 text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
        }`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:hidden" />
        ) : (
          <Circle className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        )}
        
        {/* On hover when completed, reveal uncheck option */}
        <span className="hidden group-hover:inline text-rose-600">
          {isCompleted && !isPending ? 'Bỏ xong' : ''}
        </span>
        <span className={isCompleted && !isPending ? 'inline group-hover:hidden' : 'inline'}>
          {isPending ? 'Đang lưu...' : isCompleted ? 'Đã xong' : 'Đánh dấu'}
        </span>
      </button>
      {state.errors?._form && (
        <p className="text-[11px] text-rose-500 mt-1">{state.errors._form[0]}</p>
      )}
    </form>
  );
}
