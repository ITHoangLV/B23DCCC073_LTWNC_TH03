import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { encodeReply } = require('next/dist/compiled/react-server-dom-webpack/client.node');

// Chạy với next start để kiểm tra cache ISR thật, không dùng next dev.
const base = process.env.CHECK_BASE_URL ?? 'http://localhost:3100';
const readDb = () => JSON.parse(readFileSync('data/db.json', 'utf8'));
const original = readDb();
const title = `Kiểm tra ISR ${Date.now()}`;
const results = [];
const record = (message) => { results.push(message); console.log(`PASS ${message}`); };

class Client {
  cookies = new Map();

  async request(path, options = {}) {
    const response = await fetch(base + path, {
      ...options,
      redirect: 'manual',
      headers: {
        ...options.headers,
        cookie: [...this.cookies].map(([key, value]) => `${key}=${value}`).join('; '),
      },
    });
    for (const value of response.headers.getSetCookie()) {
      const pair = value.split(';')[0];
      const index = pair.indexOf('=');
      this.cookies.set(pair.slice(0, index), pair.slice(index + 1));
    }
    return response;
  }

  async login(email, password, role) {
    const csrf = await (await this.request('/api/auth/csrf')).json();
    const response = await this.request('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', origin: base },
      body: new URLSearchParams({ csrfToken: csrf.csrfToken, email, password, callbackUrl: base + '/dashboard' }),
    });
    assert.equal(response.status, 302, 'Đăng nhập phải chuyển hướng');
    const session = await (await this.request('/api/auth/session')).json();
    assert.equal(session.user?.role, role, 'Session phải có role đúng');
    record(`Đăng nhập Credentials thật: ${role}`);
  }
}

function assertRedirect(response, pathname) {
  assert.ok([302, 303, 307, 308].includes(response.status), `Expected redirect, received ${response.status}`);
  const location = new URL(response.headers.get('location'), base);
  assert.equal(location.pathname, pathname);
  return location;
}

function decodeAttribute(value) {
  return value.replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}

const guest = new Client();
const student = new Client();
const admin = new Client();
let createdId;
let deleteActionId;

async function deleteFixture() {
  const form = new FormData();
  form.set('id', createdId);
  const body = await encodeReply([{}, form]);
  const response = await admin.request('/admin', {
    method: 'POST', headers: { origin: base, 'Next-Action': deleteActionId }, body,
  });
  assert.equal(response.status, 200, 'Server Action xóa phải thành công');
  assert.ok(!readDb().deadlines.some((d) => d.id === createdId), 'Deadline thử phải được xóa');
}

try {
  const location = assertRedirect(await guest.request('/dashboard'), '/login');
  assert.equal(new URL(location.searchParams.get('callbackUrl'), base).pathname, '/dashboard');
  record('Khách /dashboard → /login kèm callbackUrl=/dashboard');

  await student.login('sv@ptit.edu.vn', 'sv123456', 'user');
  assert.equal((await student.request('/dashboard')).status, 200);
  assertRedirect(await student.request('/admin'), '/403');
  record('Sinh viên /dashboard → 200; /admin → /403');

  await admin.login('admin@ptit.edu.vn', 'admin123', 'admin');
  const adminResponse = await admin.request('/admin');
  assert.equal(adminResponse.status, 200);
  const html = await adminResponse.text();
  const form = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].find((match) => match[1].includes('name="title"'))?.[1];
  assert.ok(form, 'Tìm thấy form thêm deadline được render thật');
  const body = new FormData();
  for (const match of form.matchAll(/<input\b[^>]*>/g)) {
    const name = match[0].match(/name="([^"]+)"/)?.[1];
    const value = match[0].match(/value="([^"]*)"/)?.[1] ?? '';
    if (name?.startsWith('$ACTION')) body.append(decodeAttribute(name), decodeAttribute(value));
  }
  const actionMetadata = [...body].find(([name]) => /\$ACTION_\d+:0/.test(name));
  const addActionId = JSON.parse(actionMetadata[1]).id;
  const manifest = JSON.parse(readFileSync('.next/server/server-reference-manifest.json', 'utf8'));
  const candidates = Object.entries(manifest.node).filter(([id, entry]) => id.startsWith('60') && id !== addActionId && entry.workers['app/(app)/admin/page']);
  assert.equal(candidates.length, 1, 'Xác định Server Action xóa từ build hiện tại');
  deleteActionId = candidates[0][0];

  // Kiểm tra cả lớp phân quyền Server Action, không chỉ chuyển hướng trang.
  const forbiddenForm = new FormData();
  forbiddenForm.set('title', title);
  forbiddenForm.set('subjectId', original.subjects[0].id);
  forbiddenForm.set('description', 'Không được lưu');
  forbiddenForm.set('dueDate', '2099-12-31T23:59');
  const forbiddenBody = await encodeReply([{}, forbiddenForm]);
  const forbidden = await student.request('/admin', { method: 'POST', headers: { origin: base, 'Next-Action': addActionId }, body: forbiddenBody });
  await forbidden.text();
  assert.deepEqual(readDb(), original, 'Sinh viên không thể thay đổi dữ liệu qua action');
  record('Sinh viên gọi action thêm: dữ liệu không thay đổi');

  for (const path of ['/', '/deadlines', '/subjects/' + original.subjects[0].slug]) {
    const response = await guest.request(path);
    assert.equal(response.status, 200);
    await response.text();
  }
  body.set('title', title);
  body.set('subjectId', original.subjects[0].id);
  body.set('description', 'Deadline tạm để kiểm tra ISR; sẽ tự xóa sau khi kiểm tra.');
  body.set('dueDate', '2099-12-31T23:59');
  const added = await admin.request('/admin', { method: 'POST', headers: { origin: base }, body });
  await added.text();
  const fixture = readDb().deadlines.find((d) => d.title === title);
  assert.ok(fixture, 'Admin thêm được deadline qua form Server Action');
  createdId = fixture.id;
  record(`Admin thêm deadline thử #${createdId} qua form thật`);

  for (const path of ['/deadlines', '/subjects/' + original.subjects[0].slug]) {
    const response = await guest.request(path);
    assert.ok((await response.text()).includes(title), `${path} phải cập nhật sau khi thêm`);
    record(`On-demand cập nhật ${path}`);
  }
  for (let i = 0; i < 2; i++) {
    const response = await guest.request('/deadlines/' + createdId);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(title));
    record(`Chi tiết #${createdId}: HTTP 200; cache=${response.headers.get('x-nextjs-cache')}`);
  }

  await deleteFixture();
  record(`Admin xóa chính deadline thử #${createdId} qua Server Action`);
  const removed = await guest.request('/deadlines/' + createdId);
  assert.equal(removed.status, 404, 'Trang chi tiết đã cache phải trả HTTP 404 sau khi xóa');
  await removed.text();
  record(`Trang cũ /deadlines/${createdId} → HTTP 404`);
  for (const path of ['/deadlines', '/subjects/' + original.subjects[0].slug]) {
    const response = await guest.request(path);
    assert.ok(!(await response.text()).includes(title), `${path} không còn deadline đã xóa`);
  }
  assert.deepEqual(readDb(), original, 'Dữ liệu gốc được giữ nguyên sau kiểm tra');
  record('Danh sách và môn học đã cập nhật; dữ liệu thử đã dọn sạch');
  console.log(`\n${results.length} kiểm tra đạt trên ${base}`);
} finally {
  if (createdId && readDb().deadlines.some((d) => d.id === createdId)) await deleteFixture();
}
