import { can, type Role, type Action } from '@/lib/permissions';

describe('permissions matrix', () => {
  // Guest: chỉ xem
  describe('guest', () => {
    it('can view deadlines', () => {
      expect(can('guest', 'deadline:view')).toBe(true);
    });
    it('cannot complete deadlines', () => {
      expect(can('guest', 'deadline:complete')).toBe(false);
    });
    it('cannot create deadlines', () => {
      expect(can('guest', 'deadline:create')).toBe(false);
    });
    it('cannot delete deadlines', () => {
      expect(can('guest', 'deadline:delete')).toBe(false);
    });
  });

  // User: xem + đánh dấu xong
  describe('user', () => {
    it('can view deadlines', () => {
      expect(can('user', 'deadline:view')).toBe(true);
    });
    it('can complete deadlines', () => {
      expect(can('user', 'deadline:complete')).toBe(true);
    });
    it('cannot create deadlines', () => {
      expect(can('user', 'deadline:create')).toBe(false);
    });
    it('cannot delete deadlines', () => {
      expect(can('user', 'deadline:delete')).toBe(false);
    });
  });

  // Admin: tất cả quyền
  describe('admin', () => {
    it('can view deadlines', () => {
      expect(can('admin', 'deadline:view')).toBe(true);
    });
    it('can complete deadlines', () => {
      expect(can('admin', 'deadline:complete')).toBe(true);
    });
    it('can create deadlines', () => {
      expect(can('admin', 'deadline:create')).toBe(true);
    });
    it('can delete deadlines', () => {
      expect(can('admin', 'deadline:delete')).toBe(true);
    });
  });

  // Type safety test - kiểm tra không có role/action ngoài danh sách
  it('covers all 3 roles and 4 actions', () => {
    const roles: Role[] = ['guest', 'user', 'admin'];
    const actions: Action[] = ['deadline:view', 'deadline:complete', 'deadline:create', 'deadline:delete'];
    
    for (const role of roles) {
      for (const action of actions) {
        expect(typeof can(role, action)).toBe('boolean');
      }
    }
  });
});

