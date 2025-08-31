# 🚀 Быстрый запуск TRAI

## 1. Настройка переменных окружения

```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env` файл:
```env
OPENAI_API_KEY=your_actual_openai_api_key
AI_MODEL=gpt-4o-mini
```

## 2. Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

## 3. Запуск

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm run dev
```

## 4. Тестирование TRAI

```bash
cd backend
npm run test-trai
```

## 5. Использование

1. Откройте: `http://localhost:5173/admin`
2. Перейдите в Writing Checker
3. Выберите пользователя
4. Нажмите "TRAI проверит"

## 🎯 TRAI готов к работе! 🤖✨