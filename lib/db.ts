import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import type { Db, Subject, Deadline, Completion } from '@/lib/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const TMP_PATH = DB_PATH + '.tmp';

// Hàng đợi ghi để tránh race condition khi nhiều request ghi đồng thời
let writeQueue: Promise<void> = Promise.resolve();

async function readDb(): Promise<Db> {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as Db;
}

// Ghi an toàn: ghi file tạm rồi rename (atomic write)
function writeDb(db: Db): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(TMP_PATH, JSON.stringify(db, null, 2), 'utf-8');
    await fs.rename(TMP_PATH, DB_PATH);
  });
  return writeQueue;
}

export async function getSubjects(): Promise<Subject[]> {
  const db = await readDb();
  return db.subjects;
}

export async function getSubjectBySlug(slug: string): Promise<Subject | undefined> {
  const db = await readDb();
  return db.subjects.find((s) => s.slug === slug);
}

export async function getDeadlines(): Promise<Deadline[]> {
  const db = await readDb();
  return db.deadlines.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

export async function getDeadlineById(id: string): Promise<Deadline | undefined> {
  const db = await readDb();
  return db.deadlines.find((d) => d.id === id);
}

export async function getUserByEmail(email: string) {
  const db = await readDb();
  return db.users.find((u) => u.email === email);
}

export async function addDeadline(
  data: Omit<Deadline, 'id' | 'createdAt'>
): Promise<Deadline> {
  const db = await readDb();
  const newId = String(Math.max(0, ...db.deadlines.map((d) => Number(d.id))) + 1);
  const deadline: Deadline = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  db.deadlines.push(deadline);
  await writeDb(db);
  return deadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const db = await readDb();
  const idx = db.deadlines.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  db.deadlines.splice(idx, 1);
  // Xóa luôn các bản ghi completion liên quan
  db.completions = db.completions.filter((c) => c.deadlineId !== id);
  await writeDb(db);
  return true;
}

export async function getCompletions(userId: string): Promise<Completion[]> {
  const db = await readDb();
  return db.completions.filter((c) => c.userId === userId);
}

export async function toggleCompletion(
  userId: string,
  deadlineId: string
): Promise<{ completed: boolean }> {
  const db = await readDb();
  const idx = db.completions.findIndex(
    (c) => c.userId === userId && c.deadlineId === deadlineId
  );
  if (idx !== -1) {
    // Bỏ đánh dấu
    db.completions.splice(idx, 1);
    await writeDb(db);
    return { completed: false };
  } else {
    // Đánh dấu xong
    db.completions.push({
      userId,
      deadlineId,
      completedAt: new Date().toISOString(),
    });
    await writeDb(db);
    return { completed: true };
  }
}
