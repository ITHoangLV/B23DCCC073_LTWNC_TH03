'use client';

import { useActionState, useTransition } from 'react';
import { deleteDeadlineAction, type DeleteDeadlineState } from '@/actions/deadline-actions';
import { Trash2, Loader2 } from 'lucide-react';

interface Props {
  deadlineId: string;
  title: string;
}

const initialState: DeleteDeadlineState = {};

export default function DeleteDeadlineButton({ deadlineId, title }: Props) {
  const [state, formAction] = useActionState(deleteDeadlineAction, initialState);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Xác nhận trước khi xóa
    if (!confirm(`Bạn có chắc muốn xóa deadline:\n"${title}"?\n\nHành động này không thể hoàn tác.`)) {
      return;
    }
    startTransition(() => {
      formAction(new FormData(e.currentTarget));
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={deadlineId} />
      <button
        type="submit"
        disabled={isPending}
        aria-label={`Xóa deadline: ${title}`}
        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Xóa deadline này"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
      {state.errors?._form && (
        <p className="text-[11px] text-rose-500 mt-1">{state.errors._form[0]}</p>
      )}
    </form>
  );
}
