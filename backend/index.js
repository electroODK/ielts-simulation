import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./src/routes/user.routes.js";
import testsRouter from "./src/routes/test.routes.js";
import resultsRouter from "./src/routes/result.routes.js";
import usersAdminRouter from "./src/routes/user.admin.routes.js";
import assignmentsRouter from "./src/routes/assignment.routes.js";
import speakingRouter from "./src/routes/speaking.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// import userRoutes from "./routes/users.js";
// import testRoutes from "./routes/tests.js";
// import resultRoutes from "./routes/results.js";

dotenv.config();

const app = express();

// ====== Middlewares ======
app.use(cors({ 
  origin: ["http://localhost:5173", "https://c1b72a908cc2.ngrok-free.app"], 
  credentials: true 
})); // ⚡️ укажи фронт

app.use(express.json());
app.use(cookieParser());
// static uploads (for speaking/writing assets)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== Routes ======
app.use("/api/auth", router);
app.use("/api/tests", testsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/users", usersAdminRouter);
app.use("/api/assignments", assignmentsRouter);
app.use("/api/speaking", speakingRouter);

// ====== DB Connection ======
const PORT = process.env.PORT || 1488;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ielts_app";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB подключена");
    app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Ошибка подключения к БД:", err);
  });
