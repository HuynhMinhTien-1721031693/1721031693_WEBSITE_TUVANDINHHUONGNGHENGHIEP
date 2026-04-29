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

- `GET /api/health` - health check
- `POST /api/career-advice` - generate AI career advice
- `GET /api/history` - latest 20 advice records

Example request body for `/api/career-advice`:

```json
{
  "message": "Em thích công nghệ, giao tiếp tốt nhưng chưa biết chọn ngành nào"
}
```
