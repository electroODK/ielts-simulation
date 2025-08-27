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

    // Хэшируем пароль
    const hash = await bcrypt.hash("12345", 10);

    // Создаём пользователя
    const user = new User({ username: "admin", password: hash });
    await user.save();

    console.log("✅ User created:", user.username);
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
