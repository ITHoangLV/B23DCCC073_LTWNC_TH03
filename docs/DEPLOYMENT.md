# Đưa Class Deadline Hub lên GitHub và Vercel

## Cấu trúc repository

Repo này chứa một ứng dụng Next.js. Đặt nội dung thư mục `class-deadline-hub` trực tiếp ở gốc repo: `package.json`, `package-lock.json`, `next.config.ts`, `app/`, `components/`, `lib/`, `data/`, `public/` cùng nằm ở cấp đầu tiên. Giữ các thư mục của ứng dụng trong cùng một repo; không tạo repo riêng cho từng thư mục.

`.env.local`, `node_modules/`, `.next/`, `.swc/` và các file cache không được commit. `.env.example` chỉ mô tả cấu hình mẫu. Các tài khoản trong dữ liệu seed là tài khoản demo công khai.

## Import vào Vercel

1. Chọn **Add New → Project**, kết nối GitHub và import `ITHoangLV/B23DCCC073_LTWNC_TH03`.
2. Chọn nhánh production `main`, Framework Preset **Next.js**, Root Directory **./**.
3. Dùng Build Command `npm run build`; giữ Install Command và Output Directory mặc định của preset. Không dùng static export vì ứng dụng có xác thực, Server Actions và ISR.
4. Thêm các biến môi trường bên dưới trước khi deploy. Sau khi đổi biến môi trường, deploy lại để cấu hình mới có hiệu lực.

| Biến | Giá trị production |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://<ten-du-an>.vercel.app` hoặc tên miền chính thức |
| `AUTH_URL` | Cùng URL production ở trên, không phải localhost |
| `AUTH_SECRET` | Secret mới, ngẫu nhiên, riêng cho production |
| `GITHUB_ID` | Client ID của GitHub OAuth App production |
| `GITHUB_SECRET` | Client secret của OAuth App; chỉ nhập trong Vercel Environment Variables |

Tạo `AUTH_SECRET` bằng `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`. Giữ giá trị này ổn định giữa các deployment để tránh làm mất hiệu lực session đang dùng. Không đưa secret thật vào README, file mẫu hoặc lịch sử Git.

## GitHub OAuth production

Trong GitHub OAuth App, đặt:

- Homepage URL: `https://<ten-mien-production>`.
- Authorization callback URL: `https://<ten-mien-production>/api/auth/callback/github`.

Nên dùng OAuth App riêng cho localhost và production để không phải đổi callback mỗi lần thử. Chọn một tên miền production ổn định khi kiểm tra đăng nhập; các preview URL thay đổi cần cấu hình OAuth phù hợp. Client secret từng được chia sẻ trong chat cần được tạo lại trước khi dùng production.

## Giới hạn cần giải quyết trước khi dùng đầy đủ trên Vercel

Hiện tại `lib/db.ts` đọc và ghi `data/db.json`. Bản local production đã kiểm tra được phân quyền và ISR, nhưng điều đó không đồng nghĩa ghi file này chạy được trên Vercel.

Vercel Functions có filesystem ứng dụng chỉ đọc; `/tmp` là vùng tạm và không phải kho lưu dữ liệu bền vững. Vì vậy thêm/xóa deadline và đánh dấu hoàn thành đang ghi JSON sẽ không hoạt động bền vững trên Vercel. Không sửa bằng cách chuyển JSON sang `/tmp` nếu cần giữ dữ liệu giữa các request, instance hoặc deployment.

Để triển khai đầy đủ, thay lớp truy cập dữ liệu trong `lib/db.ts` bằng database bên ngoài và nhập dữ liệu seed vào database đó. Các hàm xác thực và Server Actions có thể tiếp tục gọi cùng giao diện hàm dữ liệu. Chỉ bật sử dụng thực tế các chức năng ghi sau khi kiểm thử lại trên môi trường triển khai. Thay thông tin đăng nhập demo và tạo tài khoản quản trị riêng trước khi dùng dữ liệu thật.

## Kiểm tra trước khi deploy

```bash
npm ci
npm run build
npm test -- --runInBand
```

Bài kiểm tra HTTP với Credentials thật và cache ISR production:

```powershell
# Terminal 1, tại thư mục dự án
$env:AUTH_URL='http://localhost:3100'
npm.cmd run start -- --port 3100

# Terminal 2, tại cùng thư mục
node scripts/check-auth-isr.mjs
```

Script tạo và xóa một deadline thử thông qua Server Actions; dùng với bộ dữ liệu demo local. Script kiểm tra khách bị chuyển về login, sinh viên bị chặn khỏi admin, thêm deadline cập nhật danh sách và môn học, chi tiết chuyển từ cache MISS sang HIT, rồi URL cũ trả HTTP 404 sau khi xóa. Không chạy bài thử ghi dữ liệu này trên hệ thống đang phục vụ người dùng thật.

## Tài liệu tham khảo

- [Next.js trên Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Cấu hình build và Root Directory](https://vercel.com/docs/builds/configure-a-build)
- [Node.js runtime của Vercel Functions](https://vercel.com/docs/functions/runtimes/node-js)
