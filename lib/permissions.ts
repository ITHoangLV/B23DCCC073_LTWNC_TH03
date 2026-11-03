// Phân quyền tập trung - tất cả kiểm tra quyền phải đi qua can()

export type Role = 'guest' | 'user' | 'admin';
export type Action =
  | 'deadline:view'
  | 'deadline:complete'
  | 'deadline:create'
  | 'deadline:delete';

// Ma trận phân quyền duy nhất - chỉ sửa ở đây khi cần thay đổi quyền
const PERMISSIONS: Record<Role, Action[]> = {
  guest: ['deadline:view'],
  user: ['deadline:view', 'deadline:complete'],
  admin: ['deadline:view', 'deadline:complete', 'deadline:create', 'deadline:delete'],
};

export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[role].includes(action);
}
