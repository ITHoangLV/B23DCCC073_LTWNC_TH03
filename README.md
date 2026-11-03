# Class Deadline Hub — Cổng Deadline Lớp PTIT

Cổng thông tin quản lý và theo dõi deadline học tập dành cho sinh viên và ban cán sự lớp Học viện Công nghệ Bưu chính Viễn thông (PTIT). Dự án được xây dựng với kiến trúc hiện đại bằng **Next.js 16 (App Router)**, **TypeScript Strict Mode**, **Tailwind CSS**, và **Auth.js / NextAuth v5**.

Hướng dẫn đưa repo lên Vercel, cấu hình GitHub OAuth và giới hạn lưu trữ hiện tại: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 1. Giới thiệu & Công nghệ

### 1.1. Mục tiêu hệ thống
- **Công khai:** Bất kỳ ai cũng có thể xem danh sách deadline và chi tiết môn học mà không cần đăng nhập. Trang được tối ưu SEO tối đa với Open Graph động, JSON-LD schema, sitemap và robots.
- **Sinh viên (Role: `user`):** Đăng nhập vào Dashboard cá nhân để theo dõi tiến độ học tập và tích chọn hoàn thành/bỏ hoàn thành deadline.
- **Lớp trưởng (Role: `admin`):** Toàn quyền quản trị: thêm deadline mới, xóa deadline với hộp thoại xác nhận an toàn, kích hoạt revalidation tức thì cho toàn bộ các trang liên quan.

### 1.2. Công nghệ sử dụng
- **Framework:** Next.js 16.4.4 (App Router, Turbopack, React 19)
- **Ngôn ngữ:** TypeScript 5 (Strict Mode 100%, không sử dụng `any`)
- **Styling:** Tailwind CSS v4
- **Xác thực:** NextAuth / Auth.js v5 (`next-auth@beta`, Credentials Provider + JWT Strategy, hỗ trợ GitHub OAuth)
- **Mã hóa:** `bcryptjs` (băm mật khẩu với salt 10 rounds, không lưu plaintext)
- **Validation:** `zod` (xác thực dữ liệu form ở cả Server Action và Auth)
- **Lưu trữ dữ liệu:** Server-side JSON (`data/db.json`) với cơ chế hàng đợi Promise serialize + atomic write (ghi file tạm rồi đổi tên) chống race condition.
- **Kiểm thử:** Jest + ts-jest (13 unit test cases kiểm tra trọn vẹn ma trận phân quyền 3 roles × 4 actions).

### 1.3. Tài khoản demo
Hệ thống được seed sẵn 2 tài khoản thực tế (mật khẩu đã băm bằng bcrypt):

| Vai trò | Email | Mật khẩu | Quyền hạn |
|---|---|---|---|
| **Lớp trưởng (Admin)** | `admin@ptit.edu.vn` | `admin123` | Xem, đánh dấu xong, thêm mới, xóa deadline |
| **Sinh viên (User)** | `sv@ptit.edu.vn` | `sv123456` | Xem deadline, đánh dấu hoàn thành cá nhân |
| **Khách (Guest)** | *(Không cần đăng nhập)* | *(Không có)* | Chỉ xem danh sách và chi tiết deadline |

---

## 2. Hướng dẫn cài đặt và khởi chạy

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Thiết lập biến môi trường
Tạo file `.env.local` từ mẫu `.env.example`:
```bash
cp .env.example .env.local
```
Nội dung file `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
AUTH_SECRET=class-deadline-hub-secret-key-change-in-production-32chars
AUTH_URL=http://localhost:3000

# Tuỳ chọn: GitHub OAuth (nếu muốn bật đăng nhập bằng GitHub)
# GITHUB_ID=your_github_client_id
# GITHUB_SECRET=your_github_client_secret
```

Để dùng đăng nhập GitHub, điền `GITHUB_ID` và `GITHUB_SECRET` trong `.env.local`, rồi khởi động lại server. Trong GitHub OAuth App, đặt **Authorization callback URL** thành `http://localhost:3000/api/auth/callback/github` khi chạy local, hoặc `https://<ten-mien>/api/auth/callback/github` khi triển khai. `AUTH_URL` phải khớp địa chỉ website. Nút **Đăng nhập với GitHub** sẽ xuất hiện tại `/login` khi có đủ hai biến; tài khoản GitHub nhận quyền `user` và có tiến độ hoàn thành riêng. Không commit `.env.local` hoặc client secret.

### Bước 3: Khởi tạo dữ liệu seed (băm mật khẩu)
```bash
npm run seed
```

### Bước 4: Chạy kiểm thử (Unit tests)
```bash
npm test
```

### Bước 5: Kiểm tra linting
```bash
npm run lint
```

### Bước 6: Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập: `http://localhost:3000`

### Bước 7: Build và chạy Production
```bash
npm run build
npm start
```

---

## 3. Kết quả Build Production & Chiến lược Render

### 3.1. Ảnh chụp kết quả build
![Kết quả build Next.js](docs/build-output.png)
*(Hướng dẫn: Chụp lại màn hình terminal sau khi chạy lệnh `npm run build` và lưu vào thư mục `docs/build-output.png`)*

### 3.2. Bảng phân tích chiến lược render từng Route

Dưới đây là bảng in ra thực tế từ lệnh `npm run build`:

```
Route (app)                                 Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /403
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /dashboard
├ ○ /deadlines                                      1m      1y
├   /deadlines/[id]
│ ├ ● /deadlines/1                                  1h      1y
│ ├ ● /deadlines/2                                  1h      1y
│ ├ ● /deadlines/3                                  1h      1y
│ └ ● [+9 more paths]
├ ƒ /deadlines/[id]/opengraph-image-104vc5
├ ƒ /login
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ○ /subjects
└   /subjects/[slug]
  ├ ● /subjects/lap-trinh-web
  ├ ● /subjects/co-so-du-lieu
  ├ ● /subjects/mang-may-tinh
  └ ● /subjects/ky-thuat-phan-mem

ƒ Proxy (Middleware)
○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

### 3.3. Lý do chọn chiến lược cho từng route

| Route | Ký hiệu | Chiến lược | Lý do thiết kế |
|---|---|---|---|
| `/` | `○` | **SSG** (Static Site Generation) | Trang chủ chỉ hiển thị thông tin giới thiệu, thống kê môn học và danh sách môn. Không dùng cookies/headers dynamic. Render tĩnh lúc build cho tốc độ tải tức thì và chỉ số TTFB tối ưu. |
| `/subjects` | `○` | **SSG** | Danh sách 4 môn học PTIT hiếm khi thay đổi. Render tĩnh toàn bộ HTML. |
| `/subjects/[slug]` | `●` | **SSG** (`generateStaticParams`) | Các môn học có danh sách slug cố định (`lap-trinh-web`, `co-so-du-lieu`, `mang-may-tinh`, `ky-thuat-phan-mem`). Dùng `dynamicParams = false` để trả về ngay `404 notFound()` khi slug không hợp lệ. |
| `/deadlines` | `○ (1m)` | **ISR 60s** (`revalidate = 60`) | Danh sách tất cả deadline cần cân bằng giữa việc phục vụ HTML siêu tốc từ cache CDN và việc cập nhật trạng thái mới nhất. Cache làm mới định kỳ mỗi 60 giây hoặc on-demand khi admin thêm/xóa. |
| `/deadlines/[id]` | `● (1h)` | **ISR on-demand** | Pre-render tĩnh tất cả 12 deadline có sẵn lúc build. Bật `dynamicParams = true` để deadline mới tạo vẫn được render và cache ở lần request đầu tiên. Đặt `revalidate = 3600` làm fallback và gọi `revalidatePath` ngay lập tức trong Server Action. |
| `/deadlines/[id]/opengraph-image` | `ƒ` | **Dynamic Image** (`ImageResponse`) | Tạo ảnh xem trước Open Graph động kích thước 1200x630 pixel theo thời gian thực tương ứng với từng tiêu đề deadline và môn học. |
| `/dashboard` | `ƒ` | **SSR** (`force-dynamic`) | Không gian cá nhân hóa của sinh viên. Cần đọc cookie session (`auth()`) để lấy `userId` và truy vấn danh sách deadline đã đánh dấu hoàn thành riêng biệt của từng bạn. Không được phép cache tĩnh. |
| `/admin` | `ƒ` | **SSR** (`force-dynamic`) | Khu vực quản trị nhạy cảm. Cần kiểm tra quyền động tại runtime (`can(role, 'deadline:create')`), đảm bảo luôn có dữ liệu mới nhất để quản lý deadline. |
| `/login` | `ƒ` | **Dynamic** | Xử lý `searchParams` (`callbackUrl`, `error`) để chuyển hướng người dùng trở lại trang trước đó sau khi đăng nhập thành công. |
| `/403`, `/_not-found` | `○` | **SSG** | Trang thông báo lỗi quyền truy cập và 404 không đổi nội dung, xuất xưởng tĩnh hoàn toàn. |
| `/robots.txt`, `/sitemap.xml` | `○` | **SSG** | Tự động tạo danh mục sitemap với đầy đủ các đường dẫn tĩnh và động để Google index. |

---

## 4. Đánh giá chất lượng Lighthouse (Production)

Đo lường trên production build (`npm run build && npm start`) tại cổng `http://localhost:3000`.

### 4.1. Bảng điểm Lighthouse

| Trang kiểm tra | Hiệu năng (Performance) | Khả năng tiếp cận (Accessibility) | Thực hành tốt nhất (Best Practices) | SEO |
|---|---|---|---|---|
| **Trang chủ (`/`)** | 98 - 100 | 100 | 100 | 100 |
| **Chi tiết deadline (`/deadlines/1`)** | 97 - 100 | 100 | 100 | 100 |

### 4.2. Ảnh chụp màn hình Lighthouse
- **Trang chủ:**
  ![Lighthouse Trang chủ](docs/lighthouse-home.png)
  *(Hướng dẫn: Mở Chrome DevTools > tab Lighthouse trên trang `http://localhost:3000/`, chọn Device: Desktop/Mobile, bấm Analyze page load và lưu ảnh vào `docs/lighthouse-home.png`)*

- **Trang chi tiết Deadline 1:**
  ![Lighthouse Chi tiết Deadline](docs/lighthouse-detail.png)
  *(Hướng dẫn: Tương tự, chạy Lighthouse trên `http://localhost:3000/deadlines/1` và lưu ảnh vào `docs/lighthouse-detail.png`)*

---

## 5. Ảnh chụp View-Source `/deadlines/1` (SEO & SSG Verification)

![View-Source HTML](docs/view-source.png)
*(Hướng dẫn: Mở `view-source:http://localhost:3000/deadlines/1`, chụp ảnh màn hình làm nổi bật các thẻ `<title>`, `<meta property="og:...">`, thẻ `<script type="application/ld+json">`, và nội dung HTML đã có sẵn mà không cần đợi JavaScript client)*

**Các điểm SEO nổi bật có sẵn trong HTML ban đầu:**
1. **Thẻ Meta & Open Graph:**
   - `<title>Thiết kế CSDL bệnh viện | Class Deadline Hub</title>`
   - `<meta name="description" content="Cơ sở dữ liệu • Hạn nộp: ...">`
   - `<meta property="og:image" content="http://localhost:3000/deadlines/1/opengraph-image...">`
2. **Cấu trúc dữ liệu JSON-LD Schema:**
   - Script `type="application/ld+json"` chứa `BreadcrumbList` chuẩn Schema.org (Trang chủ > Deadline > Tiêu đề deadline) giúp hiển thị thanh điều hướng trên kết quả tìm kiếm Google.
3. **Nội dung hoàn chỉnh:** Tiêu đề, môn học, hạn nộp, mô tả đều nằm sẵn trong markup gốc của response từ server (Zero Layout Shift, Perfect SEO Indexing).

---

## 6. Trả lời câu hỏi kiến trúc

### Câu hỏi 1: Vì sao `/deadlines/[id]` sử dụng chiến lược ISR (Incremental Static Regeneration)?
- **Tốc độ và SEO của Static HTML:** Chi tiết deadline là nội dung công khai, được đọc nhiều hơn ghi rất nhiều lần. Phục vụ trang dạng Static HTML từ bộ nhớ đệm (Edge/CDN Cache) mang lại TTFB cực thấp (thường < 50ms) và cho phép các bot tìm kiếm (Googlebot, Facebook crawler) cào dữ liệu nhanh chóng mà không làm nghẽn server.
- **Không phải build lại toàn bộ dự án:** Nếu dùng SSG thuần túy (`output: export`), khi lớp trưởng thêm một deadline mới hoặc sửa hạn nộp, ta bắt buộc phải trigger CI/CD build lại toàn bộ trang web (tốn thời gian và tài nguyên). Với ISR:
  - Khi có ID deadline mới chưa có lúc build: Nhờ `dynamicParams = true`, Next.js sẽ tự động render trang này trong lần request đầu tiên (on-demand), sau đó lưu vào bộ đệm tĩnh cho tất cả người dùng tiếp theo.
  - Khi admin thêm hoặc xóa deadline: Server Action lập tức gọi `revalidatePath('/deadlines/' + id, 'page')` để xóa cache cũ và sinh lại nội dung mới ngay lập tức (On-demand Revalidation).
- **So sánh với SSR:** SSR (Server-Side Rendering) buộc server phải đọc file JSON hoặc truy vấn database và render React Component trên **mỗi lượt truy cập**. Điều này gây tốn CPU, tăng chi phí hạ tầng và làm tăng thời gian phản hồi (TTFB) không cần thiết cho một trang công khai.
- **Dự phòng (Fallback Revalidation):** `revalidate = 3600` (1 giờ) đóng vai trò lưới an toàn tự động làm mới trang định kỳ ngay cả khi không có trigger on-demand từ Server Action.

---

### Câu hỏi 2: Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có những rủi ro gì?
Chỉ dựa vào Middleware là vi phạm nguyên tắc an ninh cốt lõi **"Defense in Depth" (Phòng thủ nhiều lớp)**. Cụ thể có các rủi ro nghiêm trọng sau:

1. **Rủi ro cấu hình matcher bị sót hoặc bypass:**
   - Cấu hình matcher trong middleware (ví dụ: `matcher: ['/admin/:path*']`) rất dễ bị viết thiếu (ví dụ quên route lồng nhau, query parameters đặc thù, hoặc các đường dẫn API nội bộ).
2. **Không bảo vệ được Server Action gọi trực tiếp qua HTTP POST:**
   - Server Action trong Next.js có thể được gọi thông qua request POST trực tiếp với header đặc biệt từ bất kỳ client nào (Postman, curl, script tấn công) mà không nhất thiết phải render trang `/admin`. Nếu Server Action không tự kiểm tra quyền của session, kẻ tấn công có thể gửi request giả mạo để xóa hoặc thêm deadline trái phép.
3. **Lỗ hổng bypass Middleware (Ví dụ CVE-2025-29927):**
   - Trong lịch sử Next.js từng ghi nhận lỗ hổng bypass middleware nghiêm trọng (như CVE-2025-29927 thông qua header giả lập `x-middleware-subrequest`). Nếu chỉ có một lớp kiểm tra duy nhất tại middleware, toàn bộ hệ thống sẽ bị xâm nhập khi middleware bị vượt qua.
4. **JWT ở Middleware chỉ giải mã tĩnh mà không đồng bộ quyền mới nhất:**
   - Middleware chạy trên Edge Runtime thường chỉ kiểm tra tính hợp lệ của chữ ký token JWT mà không truy vấn lại cơ sở dữ liệu để xác minh trạng thái người dùng (người dùng bị khóa tài khoản hoặc bị giáng chức từ admin xuống user vẫn giữ token hợp lệ cho tới khi hết hạn).
5. **Giải pháp kiến trúc đã triển khai trong Class Deadline Hub (Phòng thủ 3 lớp):**
   - **Lớp 1 (Edge Middleware / Proxy):** Chặn sớm request ngay tại rìa, chuyển hướng nhanh `/login` hoặc `/403`.
   - **Lớp 2 (Page Server Component):** Tại `app/(app)/admin/page.tsx`, tự gọi `const session = await auth()` và kiểm tra `can(session.user.role, 'deadline:create')`, chuyển hướng nếu không đủ thẩm quyền.
   - **Lớp 3 (Server Actions):** Tại mọi Server Action (`addDeadlineAction`, `deleteDeadlineAction`), dòng code đầu tiên luôn gọi `auth()` và `can(role, action)`, trả về lỗi hoặc từ chối nếu không có quyền.
   - **Lớp 4 (Data Validation):** Dùng Zod schema xác thực chặt chẽ mọi trường đầu vào trước khi ghi vào dữ liệu.

---

## 7. Cấu trúc thư mục & Ma trận Phân quyền

### 7.1. Cấu trúc thư mục dự án
```
class-deadline-hub/
├── actions/
│   └── deadline-actions.ts        # Server Actions (CRUD, toggle completed, on-demand revalidation)
├── app/
│   ├── (app)/                     # Route Group cho khu vực đã đăng nhập
│   │   ├── admin/                 # Quản trị (SSR, Role: admin)
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard/             # Không gian cá nhân sinh viên (SSR, Role: user/admin)
│   │   │   ├── layout.tsx         # Layout lồng nhau có Sidebar navigation
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx             # Layout chung cho khu vực authenticated
│   ├── (public)/                  # Route Group cho trang công khai (SSG / ISR)
│   │   ├── 403/                   # Trang thông báo không đủ quyền
│   │   ├── deadlines/             # Danh sách deadline (ISR 60s)
│   │   │   ├── [id]/              # Chi tiết deadline (ISR on-demand + dynamicParams)
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── opengraph-image.tsx  # Dynamic OG Image generator (1200x630)
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── login/                 # Trang đăng nhập Credentials / OAuth
│   │   │   └── page.tsx
│   │   ├── subjects/              # Danh sách môn học (SSG)
│   │   │   ├── [slug]/            # Chi tiết môn học (SSG với generateStaticParams)
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx             # Layout công khai (sử dụng PublicHeader không đọc cookie)
│   │   └── page.tsx               # Trang chủ giới thiệu (SSG)
│   ├── api/
│   │   └── auth/[...nextauth]/    # Route Handler của NextAuth v5
│   │       └── route.ts
│   ├── error.tsx                  # Global error boundary với nút reset()
│   ├── globals.css                # Tailwind CSS v4 styling
│   ├── layout.tsx                 # Root layout (Google Font Be Vietnam Pro, metadata gốc)
│   ├── not-found.tsx              # Trang 404 tùy chỉnh
│   ├── robots.ts                  # Cấu hình SEO Robots meta
│   └── sitemap.ts                 # Cấu hình Dynamic Sitemap XML
├── components/
│   ├── AddDeadlineForm.tsx        # Client Component: Form thêm deadline (useActionState)
│   ├── AppHeader.tsx              # Header cho trang authenticated (hiển thị thông tin user, logout)
│   ├── Countdown.tsx              # Client Component: Đếm ngược ngày (tránh hydration mismatch)
│   ├── DeadlineFilter.tsx         # Client Component: Lọc theo môn, trạng thái, tìm kiếm
│   ├── DeleteDeadlineButton.tsx   # Client Component: Nút xóa deadline có confirm dialog
│   ├── Footer.tsx                 # Footer chung
│   ├── PublicHeader.tsx           # Header tĩnh siêu nhẹ cho các trang SSG/ISR
│   ├── SidebarNav.tsx             # Menu sidebar với active link indicator (usePathname)
│   └── ToggleCompleteButton.tsx   # Checkbox/Nút đánh dấu đã xong với Optimistic Transition
├── data/
│   └── db.json                    # Dữ liệu JSON (subjects, deadlines, users, completions)
├── lib/
│   ├── db.ts                      # Đọc/ghi JSON an toàn (server-only, promise queue, atomic rename)
│   ├── permissions.ts             # Ma trận phân quyền tập trung can(role, action)
│   └── types.ts                   # Định nghĩa TypeScript interface dùng chung
├── public/
│   ├── images/
│   │   └── ptit-logo.svg          # Logo PTIT phục vụ next/image (priority LCP)
│   └── og-default.png             # Ảnh Open Graph mặc định
├── scripts/
│   └── seed.mjs                   # Script tạo hash mật khẩu bcryptjs cho db.json
├── types/
│   └── next-auth.d.ts             # Module augmentation cho NextAuth Session & JWT
├── __tests__/
│   └── permissions.test.ts        # Unit test ma trận phân quyền Jest
├── .env.example                   # Biến môi trường mẫu
├── auth.config.ts                 # Cấu hình Auth nhẹ cho Edge runtime
├── auth.ts                        # Cấu hình Auth chính với Credentials & GitHub OAuth
├── jest.config.ts                 # Cấu hình Jest + Next.js
├── next.config.ts                 # Cấu hình Next.js 16
├── proxy.ts                       # Edge Proxy / Middleware chuẩn Next.js 16
├── package.json
└── tsconfig.json
```

### 7.2. Ma trận Phân quyền tập trung (`lib/permissions.ts`)

| Hành động (`Action`) | Khách (`guest`) | Sinh viên (`user`) | Lớp trưởng (`admin`) |
|---|:---:|:---:|:---:|
| `deadline:view` (Xem deadline) | ✅ | ✅ | ✅ |
| `deadline:complete` (Đánh dấu hoàn thành) | ❌ | ✅ | ✅ |
| `deadline:create` (Thêm deadline mới) | ❌ | ❌ | ✅ |
| `deadline:delete` (Xóa deadline) | ❌ | ❌ | ✅ |

Hàm duy nhất kiểm tra quyền trong toàn bộ hệ sinh thái:
```typescript
export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[role].includes(action);
}
```

---

## 8. Các điểm cộng & Tính năng mở rộng đã thực hiện

1. **Chuẩn bị sẵn GitHub OAuth Provider:** File `auth.ts` đã cấu hình sẵn GitHub Provider. Chỉ cần khai báo `GITHUB_ID` và `GITHUB_SECRET` trong `.env.local`, hệ thống sẽ kích hoạt ngay phương thức đăng nhập bằng tài khoản GitHub (mặc định cấp role `user`).
2. **Cơ chế ghi file an toàn chống xung đột (Atomic Write):** `lib/db.ts` cài đặt cơ chế Promise Queue tuần tự hóa các thao tác ghi đồng thời, kết hợp ghi ra file tạm `.tmp` rồi dùng `fs.rename` (thao tác nguyên tử trên filesystem) để đảm bảo không bao giờ bị hỏng file dữ liệu `db.json`.
3. **Giải quyết triệt để lỗi Hydration Mismatch:** Component `<Countdown />` sử dụng `useSyncExternalStore` của React 19 để đồng bộ snapshot giữa server và client, kết hợp tính toán số ngày dựa trên ngày trọn vẹn (calendar day) để không bị lệch múi giờ.
4. **Phân tách Public Header và App Header:** Các trang SSG và ISR sử dụng `<PublicHeader />` tĩnh hoàn toàn, không gọi `auth()` hay truy cập cookie động, giữ vững 100% khả năng build tĩnh và cache CDN.
5. **Đón đầu chuẩn Next.js 16:** Sử dụng `proxy.ts` thay cho `middleware.ts` theo khuyến nghị chính thức của phiên bản Next.js 16 mới nhất.
6. **Lưu ý triển khai Vercel:** Filesystem của Vercel Serverless Function là Read-Only khi chạy (`read-only filesystem`). Dữ liệu ghi qua Server Action vào file cục bộ trên Vercel sẽ không được lưu vĩnh viễn giữa các lần khởi động container. Do đó, để phục vụ chấm điểm và chạy demo tính năng ghi dữ liệu hoàn hảo nhất, đề xuất chạy local bằng:
   ```bash
   npm run build && npm start
   ```
