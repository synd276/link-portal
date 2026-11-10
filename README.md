# Link Portal – Nền tảng quản lý đa chức năng & liên kết tập trung

Link Portal là ứng dụng web quản trị và truy cập website tập trung chuẩn SaaS chuyên nghiệp, được xây dựng với **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, và **Supabase PostgreSQL & Auth**.

---

## 🌟 Tính năng nổi bật

### Dành cho người dùng (User)
- **Đăng ký & Đăng nhập:** Xác thực người dùng an toàn qua Supabase Auth, hỗ trợ quên mật khẩu và đặt lại mật khẩu.
- **Bố cục 3 cột (Modern SaaS Dashboard):**
  - **Cột trái (20%):** Logo, điều hướng chính, danh mục, thông tin tài khoản, nút thu gọn sidebar.
  - **Cột giữa (55%):** Tìm kiếm liên kết với bộ lọc đa năng, thẻ website với favicon tự động, truy cập nhanh (Quick Access), yêu thích, và danh sách phân loại.
  - **Cột phải (25%):** Ghi chú nhanh (Quick Notes), lịch sử truy cập (Recent Visits - ghi nhận thời gian khi click mở liên kết), và danh sách website yêu thích.
- **Quản lý liên kết cá nhân (Personal Websites):** Thêm, sửa, xóa các website riêng tư. Chỉ chủ sở hữu mới có quyền xem và quản lý.
- **Quản lý danh mục cá nhân:** Phân loại website theo danh mục riêng hoặc dùng danh mục hệ thống.
- **Bộ lọc & Tìm kiếm tức thì:** Tìm theo tên, URL, mô tả, danh mục; lọc Global/Personal/Favorites; sắp xếp A-Z, mới thêm, nổi bật.
- **Giao diện Light / Dark Mode:** Tùy biến giao diện và ghi nhớ cài đặt vào cơ sở dữ liệu `user_settings`.

### Dành cho Quản trị viên (Admin)
- **Admin Dashboard:** Thống kê tổng người dùng, tổng website, website hệ thống (Global), website cá nhân (Personal), tổng danh mục.
- **Quản lý Website toàn hệ thống (Global Websites):** Thêm, sửa, xóa, gắn cờ nổi bật (Featured), tùy chỉnh thứ tự sắp xếp (Sort Order).
- **Quản lý Danh mục:** Tạo và quản trị danh mục dùng chung toàn hệ thống.
- **Quản lý Người dùng & Phân quyền:** Tra cứu thành viên, thăng cấp Admin hoặc hạ quyền User an toàn, chống leo thang đặc quyền.
- **Bảo mật cơ sở dữ liệu:** Supabase Row Level Security (RLS) được áp dụng trên toàn bộ 7 bảng.

---

## 🛠️ Công nghệ sử dụng

- **Framework:** Next.js 16 (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Cơ sở dữ liệu & Xác thực:** Supabase (PostgreSQL + Auth SSR)
- **Form Validation:** React Hook Form + Zod
- **Thông báo:** Sonner
- **Triển khai:** Vercel & GitHub Actions

---

## 🚀 Hướng dẫn cài đặt & triển khai

### 1. Cài đặt Dependencies

Yêu cầu Node.js phiên bản 18.x trở lên (khuyên dùng Node 20+):

```bash
npm install
```

---

### 2. Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com) và đăng ký/đăng nhập.
2. Nhấn **New project**, đặt tên (ví dụ: `link-portal`), chọn mật khẩu database và khu vực (khuyên dùng `Southeast Asia (Singapore)`).
3. Đợi vài phút để Supabase khởi tạo project hoàn tất.

---

### 3. Cấu hình Environment Variables

Sao chép file `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

Mở file `.env.local` và điền thông tin từ Supabase (vào **Project Settings** -> **API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Lưu ý bảo mật:** File `.env.local` chứa cấu hình môi trường cục bộ và đã được cấu hình trong `.gitignore` để không bao giờ commit lên GitHub.

---

### 4. Chạy Database Migrations

Vào Supabase Dashboard -> **SQL Editor** -> **New query**:
Mở file `supabase/migrations/20261110000000_init_link_portal.sql` trong project, sao chép toàn bộ nội dung và dán vào SQL Editor của Supabase, sau đó nhấn **Run**.

Migration này sẽ tự động:
- Tạo 7 bảng: `profiles`, `categories`, `websites`, `user_favorites`, `user_visits`, `user_settings`, `user_notes`.
- Cấu hình các Trigger tự động khởi tạo hồ sơ và cài đặt khi người dùng đăng ký.
- Bật **Row Level Security (RLS)** và áp dụng đầy đủ các Policies bảo vệ dữ liệu.
- Nạp sẵn danh mục và website mẫu (Google, ChatGPT, GitHub, Figma, Notion...).

---

### 5. Tạo tài khoản Admin đầu tiên một cách an toàn

1. Khởi chạy ứng dụng hoặc truy cập trang `/register` để đăng ký tài khoản của bạn (ví dụ: `admin@example.com`).
2. Mở Supabase SQL Editor và chạy lệnh thăng cấp tài khoản này lên Quản trị viên:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

Hoặc sử dụng function có sẵn trong `supabase/migrations/create_admin_helper.sql`:

```sql
SELECT public.promote_user_to_admin('admin@example.com');
```

Sau khi chạy lệnh trên, tài khoản của bạn sẽ có quyền truy cập toàn bộ menu và route `/admin`.

---

### 6. Khởi chạy Development Server

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

### 7. Kiểm tra & Build Production

Kiểm tra TypeScript và Build:

```bash
npm run build
```

---

### 8. Triển khai lên Vercel

#### Cách 1: Triển khai qua GitHub Actions (Tự động)
Project đã tích hợp workflow `.github/workflows/deploy-vercel.yml`. Bạn chỉ cần thêm 3 Secrets trong GitHub Repository (**Settings** -> **Secrets and variables** -> **Actions**):
- `VERCEL_TOKEN`: Token lấy từ tài khoản Vercel cá nhân.
- `VERCEL_ORG_ID`: Org ID từ dự án Vercel.
- `VERCEL_PROJECT_ID`: Project ID từ dự án Vercel.

Khi push code lên branch `main`, GitHub Actions sẽ tự động kiểm tra và deploy lên production.

#### Cách 2: Triển khai trực tiếp qua Vercel Dashboard
1. Truy cập [https://vercel.com](https://vercel.com) và chọn **Add New** -> **Project**.
2. Nhập repository `https://github.com/synd276/link-portal`.
3. Thêm các biến môi trường trong mục **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Nhấn **Deploy**.

---

## 🛡️ Cấu trúc thư mục

```
link-portal/
├── app/
│   ├── (admin)/admin/          # Các trang quản trị hệ thống
│   ├── (auth)/                 # Đăng nhập, đăng ký, quên & đặt lại mật khẩu
│   ├── (user)/                 # Dashboard, websites, categories, recent, settings
│   ├── actions/                # Server Actions (Auth, Websites, Categories, Notes, Admin)
│   ├── globals.css             # Tailwind CSS v4 & theme variables
│   └── layout.tsx              # Root Layout, ThemeProvider, Sonner Toaster
├── components/
│   ├── admin/                  # Bảng quản lý Admin (Websites, Categories, Users, Stats)
│   ├── categories/             # Danh mục, dialog thêm/sửa
│   ├── dashboard/              # View tổng quan Dashboard
│   ├── forms/                  # Form đăng nhập, đăng ký với Zod
│   ├── layout/                 # Sidebar trái, Header, Right Sidebar, Mobile Drawer
│   ├── ui/                     # Bộ UI Components shadcn (Button, Dialog, Select...)
│   └── websites/               # Thẻ Website, Grid, Dialog thêm/sửa
├── lib/
│   ├── supabase/               # Supabase SSR client, server & middleware
│   ├── validations/            # Zod validation schemas
│   ├── data.ts                 # Data fetching queries
│   └── utils.ts                # Favicon URL, Domain parser, Helpers
├── supabase/
│   └── migrations/             # Full SQL migration & RLS policies
└── types/                      # TypeScript definitions & Database models
```

---

## 📄 Bản quyền

Phát triển bởi Link Portal Team © 2026.
