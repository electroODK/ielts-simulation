import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./src/routes/user.routes.js";
import testsRouter from "./src/routes/test.routes.js";
import resultsRouter from "./src/routes/result.routes.js";
import usersAdminRouter from "./src/routes/user.admin.routes.js";
import cookieParser from "cookie-parser";

// import userRoutes from "./routes/users.js";
// import testRoutes from "./routes/tests.js";
// import resultRoutes from "./routes/results.js";

dotenv.config();

const app = express();

// ====== Middlewares ======
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // ⚡️ укажи фронт

app.use(express.json());
app.use(cookieParser());

// ====== Routes ======
app.use("/api/auth", router);
app.use("/api/tests", testsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/users", usersAdminRouter);

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
