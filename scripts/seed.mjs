// scripts/seed.mjs - Tạo password hash cho db seed
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

async function seed() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const svHash = await bcrypt.hash('sv123456', 10);

  const db = JSON.parse(readFileSync(DB_PATH, 'utf-8'));

  const adminUser = db.users.find(u => u.email === 'admin@ptit.edu.vn');
  const svUser = db.users.find(u => u.email === 'sv@ptit.edu.vn');

  if (adminUser) adminUser.passwordHash = adminHash;
  if (svUser) svUser.passwordHash = svHash;

  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  console.log('✅ Seed hoàn tất! Password hashes đã được cập nhật.');
  console.log('   admin@ptit.edu.vn / admin123');
  console.log('   sv@ptit.edu.vn / sv123456');
}

seed().catch(console.error);
