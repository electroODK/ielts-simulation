import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ivanovivan91902:VtrfM7pRey9pN7kS@cluster0.lcaijhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function checkUsers() {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB подключена");

    // Получаем всех пользователей
    const users = await User.find({}, { password: 0 });
    
    console.log(`\n📊 Всего пользователей: ${users.length}`);
    
    if (users.length === 0) {
      console.log("❌ В базе нет пользователей!");
      return;
    }

    console.log("\n👥 Список пользователей:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log("---");
    });

    // Проверяем роли
    const roles = [...new Set(users.map(u => u.role))];
    console.log(`\n🔑 Найденные роли: ${roles.join(', ')}`);

    // Проверяем writing-checker
    const writingCheckers = users.filter(u => u.role === 'writing-checker');
    if (writingCheckers.length === 0) {
      console.log("\n❌ Нет пользователей с ролью 'writing-checker'");
      console.log("💡 Создайте пользователя: npm run create-writing-checker");
    } else {
      console.log(`\n✅ Найдено writing-checker: ${writingCheckers.length}`);
      writingCheckers.forEach(user => {
        console.log(`   - ${user.username} (${user._id})`);
      });
    }

  } catch (error) {
    console.error("❌ Ошибка при проверке пользователей:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Отключение от MongoDB");
  }
}

// Запускаем проверку
checkUsers();