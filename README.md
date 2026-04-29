# Career Guidance Platform

Full-stack web app for career orientation:

- Frontend: Next.js (React) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- AI: OpenAI API

## Project Structure

```txt
career-guidance/
  app/                  # Next.js App Router frontend
  backend/              # Express API server
    src/config/         # MongoDB connection
    src/models/         # Mongoose models
    src/routes/         # API endpoints
    src/services/       # OpenAI integration
```

## Setup Project

### 1) Install dependencies

```bash
npm install
npm install --prefix backend
```

### 2) Configure environment variables

Create frontend env:

```bash
cp .env.example .env.local
```

Create backend env:

```bash
cp backend/.env.example backend/.env
```

Required variables:

- `NEXT_PUBLIC_API_BASE_URL` (example: `http://localhost:4000`)
- `MONGODB_URI`
- `OPENAI_API_KEY` (or Gemini key if you adapt AI service)
- `OPENAI_MODEL` (optional)

### 3) Run development server

Run frontend + backend together:

```bash
npm run dev:all
```

Or run separately:

- Frontend: `npm run dev`
- Backend: `npm run dev --prefix backend`

App URLs:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)

## API Endpoints (Backend)

- Public:
  - `GET /api/health` - health check
  - `POST /api/auth/register` - register new user
  - `POST /api/auth/login` - login and receive JWT
- Protected (require `Authorization: Bearer <token>`):
  - `GET /api/auth/me` - get current user profile
  - `POST /api/career-advice` - generate AI career advice and save history
  - `GET /api/history` - latest 20 advice records of current user
  - `POST /api/test-results` - save test result of current user
  - `GET /api/test-results` - list test result history of current user
  - `POST /api/assessments` - save assessment detail of current user
  - `GET /api/assessments` - list assessment history of current user

Example request body for `/api/career-advice`:

```json
{
  "message": "Em thích công nghệ, giao tiếp tốt nhưng chưa biết chọn ngành nào"
}
```

## Feature Checklist

Basic features:

- Trang giới thiệu ngành nghề / lĩnh vực: `/careers`
- Bài test trắc nghiệm tính cách / năng lực (RIASEC + MBTI mini): `/quiz`
- Hiển thị kết quả và gợi ý nghề phù hợp: tại trang `/quiz` và `/dashboard`
- Đăng ký / đăng nhập tài khoản (JWT): `/auth`
- Lưu lịch sử kết quả: localStorage + MongoDB (`/api/test-results`) khi đã đăng nhập (phụ thuộc trạng thái auth)

Advanced features:

- Đặt lịch tư vấn 1-1 với chuyên gia: `/booking` (form khởi tạo, chưa hoàn chỉnh)
- Blog xu hướng nghề nghiệp: `/blog`
- Tìm kiếm và lọc ngành nghề: trong `/careers`
- Dashboard quản trị (admin): `/admin` (khung quản trị, chỉ là skeleton)
- Giao diện responsive: các trang dùng Tailwind grid/flex theo breakpoints
