// createUser.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const createUser = async () => {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Проверяем, существует ли уже админ
    const existingAdmin = await User.findOne({ username: "admin2" });
    if (existingAdmin) {
      console.log("ℹ️ Admin already exists:", existingAdmin.username);
    } else {
      // Хэшируем пароль
      const hash = await bcrypt.hash("12345", 10);

      // Создаём администратора
      const adminUser = new User({ username: "admin2", password: hash, role: "admin", status: "ready" });
      await adminUser.save();
      console.log("✅ Admin user created:", adminUser.username);
    }
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
  } finally {
    // Закрываем соединение
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit();
  }
};

createUser();
