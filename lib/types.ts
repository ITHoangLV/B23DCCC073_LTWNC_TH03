// Các kiểu dữ liệu dùng chung trong toàn dự án

export interface Subject {
  id: string;
  slug: string;
  name: string;
  teacher: string;
  description: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string; // ISO 8601
  createdAt: string; // ISO 8601
}

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

export interface Completion {
  userId: string;
  deadlineId: string;
  completedAt: string;
}

export interface Db {
  subjects: Subject[];
  deadlines: Deadline[];
  users: DbUser[];
  completions: Completion[];
}
