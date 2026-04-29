import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./config/db.js";
import adviceRouter from "./routes/advice.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "career-guidance-backend" });
});

app.use("/api", adviceRouter);
app.use("/api", authRouter);

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect MongoDB:", error);
    process.exit(1);
  });
