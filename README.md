# CareerPath VN

Nền tảng tư vấn định hướng nghề nghiệp cho học sinh/sinh viên Việt Nam.

- Frontend: Next.js App Router + Tailwind CSS
- Backend: Express + Mongoose
- Database: MongoDB
- AI: OpenAI

## Cấu trúc dự án

```txt
career-guidance/
  app/                  # Next.js frontend
  components/           # shared UI components
  lib/                  # client helpers
  backend/              # Express API
    src/config/         # DB config
    src/models/         # Mongoose models
    src/routes/         # API routes
    src/services/       # OpenAI service
```

## Cài đặt đầy đủ

### 1) Cài dependencies

```bash
npm install
npm install --prefix backend
```

### 2) Tạo file môi trường

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```

Nội dung bắt buộc:

`/.env.example`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

`/backend/.env.example`

```env
MONGODB_URI=mongodb://localhost:27017/career-guidance
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-key
PORT=4000
```

### 3) Chạy dự án

```bash
npm run dev:all
```

Hoặc chạy riêng:

- Frontend: `npm run dev`
- Backend: `npm run dev --prefix backend`

## URL local

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

## API chính

Public:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/career-advice`

Protected (`Authorization: Bearer <token>`):

- `GET /api/auth/me`
- `POST /api/assessment`
- `GET /api/assessment/my`
- `GET /api/history`
- `POST /api/test-results`
- `GET /api/test-results`

## Lưu ý frontend

- Tất cả API call dùng:
  - `const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"`
- Các API protected phải gửi:
  - `Authorization: Bearer ${localStorage.getItem("token")}`
