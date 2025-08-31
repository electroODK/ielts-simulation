import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ivanovivan91902:VtrfM7pRey9pN7kS@cluster0.lcaijhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function createWritingChecker() {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB подключена");

    // Проверяем, существует ли уже пользователь с такой ролью
    const existingUser = await User.findOne({ role: "writing-checker" });
    if (existingUser) {
      console.log("ℹ️ Пользователь с ролью 'writing-checker' уже существует:");
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   ID: ${existingUser._id}`);
      return;
    }

    // Создаем нового пользователя
    const username = "writing_checker";
    const password = "writing123";
    const role = "writing-checker";

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      password: hashedPassword,
      role
    });

    console.log("✅ Пользователь 'writing-checker' успешно создан:");
    console.log(`   Username: ${user.username}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Password: ${password}`);
    console.log("\n🔑 Используйте эти данные для входа в Writing Checker Panel");

  } catch (error) {
    console.error("❌ Ошибка при создании пользователя:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Отключение от MongoDB");
  }
}

// Запускаем создание пользователя
createWritingChecker();