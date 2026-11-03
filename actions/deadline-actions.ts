'use server';

import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { z } from 'zod';
import {
  addDeadline,
  deleteDeadline,
  getDeadlineById,
  getSubjects,
  toggleCompletion,
} from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Schema validate thêm deadline
const addDeadlineSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(120, 'Tiêu đề tối đa 120 ký tự'),
  description: z.string().max(1000, 'Mô tả tối đa 1000 ký tự'),
  subjectId: z.string().min(1, 'Vui lòng chọn môn học'),
  dueDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Ngày không hợp lệ'),
});

export type AddDeadlineState = {
  errors?: {
    title?: string[];
    description?: string[];
    subjectId?: string[];
    dueDate?: string[];
    _form?: string[];
  };
  success?: boolean;
};

// Action thêm deadline - chỉ admin
export async function addDeadlineAction(
  prevState: AddDeadlineState,
  formData: FormData
): Promise<AddDeadlineState> {
  // Lớp 2 kiểm tra quyền (lớp 1 là middleware)
  const session = await auth();
  const role = session?.user?.role ?? 'guest';
  if (!can(role, 'deadline:create')) {
    return { errors: { _form: ['Không có quyền thực hiện hành động này'] } };
  }

  // Validate subjectId tồn tại
  const subjects = await getSubjects();
  const subjectIds = subjects.map((s) => s.id);

  const raw = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) ?? '',
    subjectId: formData.get('subjectId') as string,
    dueDate: formData.get('dueDate') as string,
  };

  const parsed = addDeadlineSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  if (!subjectIds.includes(parsed.data.subjectId)) {
    return { errors: { subjectId: ['Môn học không tồn tại'] } };
  }

  const deadline = await addDeadline(parsed.data);

  // Revalidate on-demand: cập nhật trang danh sách và trang chi tiết
  revalidatePath('/');
  revalidatePath('/deadlines');
  revalidatePath('/deadlines/' + deadline.id);
  revalidatePath('/subjects');
  // Revalidate trang môn học liên quan
  const subject = subjects.find((s) => s.id === deadline.subjectId);
  if (subject) {
    revalidatePath('/subjects/' + subject.slug);
  }
  revalidatePath('/sitemap.xml');

  return { success: true };
}

export type DeleteDeadlineState = {
  errors?: { _form?: string[] };
  success?: boolean;
};

// Action xóa deadline - chỉ admin
export async function deleteDeadlineAction(
  prevState: DeleteDeadlineState,
  formData: FormData
): Promise<DeleteDeadlineState> {
  // Lớp 2 kiểm tra quyền
  const session = await auth();
  const role = session?.user?.role ?? 'guest';
  if (!can(role, 'deadline:delete')) {
    return { errors: { _form: ['Không có quyền thực hiện hành động này'] } };
  }

  const id = formData.get('id') as string;
  if (!id) {
    return { errors: { _form: ['ID deadline không hợp lệ'] } };
  }

  // Validate deadline tồn tại
  const deadline = await getDeadlineById(id);
  if (!deadline) {
    return { errors: { _form: ['Deadline không tồn tại'] } };
  }

  const subjects = await getSubjects();
  await deleteDeadline(id);

  // Revalidate on-demand
  revalidatePath('/');
  revalidatePath('/deadlines');
  revalidatePath('/deadlines/' + id);
  revalidatePath('/subjects');
  const subject = subjects.find((s) => s.id === deadline.subjectId);
  if (subject) {
    revalidatePath('/subjects/' + subject.slug);
  }
  revalidatePath('/sitemap.xml');

  return { success: true };
}

export type ToggleCompleteState = {
  errors?: { _form?: string[] };
  completed?: boolean;
};

// Action đánh dấu deadline đã xong - user và admin
export async function toggleCompleteAction(
  prevState: ToggleCompleteState,
  formData: FormData
): Promise<ToggleCompleteState> {
  // Lớp 2 kiểm tra quyền
  const session = await auth();
  const role = session?.user?.role ?? 'guest';
  if (!can(role, 'deadline:complete')) {
    return { errors: { _form: ['Vui lòng đăng nhập để đánh dấu deadline'] } };
  }

  const userId = session!.user.id;
  const deadlineId = formData.get('deadlineId') as string;

  if (!deadlineId) {
    return { errors: { _form: ['DeadlineID không hợp lệ'] } };
  }

  // Validate deadline tồn tại
  const deadline = await getDeadlineById(deadlineId);
  if (!deadline) {
    return { errors: { _form: ['Deadline không tồn tại'] } };
  }

  const result = await toggleCompletion(userId, deadlineId);
  revalidatePath('/dashboard');

  return { completed: result.completed };
}
