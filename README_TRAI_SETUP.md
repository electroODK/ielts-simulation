# 🚀 Настройка TRAI (GPT интеграции) для Writing Checker

## Что такое TRAI?

**TRAI (Трай)** - это AI ассистент на базе GPT, который помогает проверять IELTS Writing задания. Он анализирует работы по критериям IELTS и выдает объективные оценки.

## 🛠️ Установка и настройка

### 1. Переменные окружения

Создайте файл `.env` в папке `backend/` на основе `.env.example`:

```bash
cd backend
cp .env.example .env
```

Заполните следующие переменные:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini

# JWT Secrets (замените на свои)
ACCESS_SECRET=your_access_secret_here
REFRESH_SECRET=your_refresh_secret_here

# MongoDB (замените на свою строку подключения)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server
PORT=1488
```

### 2. Получение OpenAI API ключа

1. Зарегистрируйтесь на [OpenAI Platform](https://platform.openai.com/)
2. Перейдите в раздел API Keys
3. Создайте новый API ключ
4. Скопируйте ключ в переменную `OPENAI_API_KEY`

### 3. Запуск проекта

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## 🎯 Как использовать TRAI

### В Writing Checker Panel:

1. **Откройте админ панель**: `http://localhost:5173/admin`
2. **Перейдите в Writing Checker**: `http://localhost:5173/checker/writing`
3. **Выберите пользователя** с неоцененными работами
4. **Нажмите "TRAI проверит"** для автоматической проверки
5. **Просмотрите результат** - TRAI даст оценку по критериям IELTS
6. **Примените оценку TRAI** или поставьте свою вручную

### Что проверяет TRAI:

- **Task Achievement** - выполнение задания
- **Coherence & Cohesion** - связность и логичность  
- **Lexical Resource** - словарный запас
- **Grammatical Range** - грамматика

## 🔧 Технические детали

### Backend API:

- **POST** `/api/ai/check-writing` - проверка writing задания
- **Параметры**: `task1Text`, `task2Text`, `taskType`
- **Ответ**: структурированная оценка по критериям IELTS

### Модель ответа TRAI:

```json
{
  "overall_band": 7.0,
  "criteria": {
    "task_achievement": 7.0,
    "coherence_cohesion": 6.5,
    "lexical_resource": 7.5,
    "grammatical_range": 7.0
  },
  "detailed_feedback": "Подробный анализ...",
  "strengths": ["Сильные стороны..."],
  "areas_for_improvement": ["Области для улучшения..."],
  "recommendations": "Конкретные рекомендации..."
}
```

## 🎨 Интерфейс

### Новые элементы:

- **🤖 Проверка TRAI** - секция с кнопкой проверки
- **TRAI результат** - отображение оценки и анализа
- **Применить оценку TRAI** - кнопка для применения результата
- **Ручная оценка** - возможность поставить свою оценку

### Стилизация:

- Градиентный дизайн для TRAI секции
- Анимации и hover эффекты
- Адаптивная верстка для мобильных устройств
- Индикатор загрузки во время проверки

## 🚨 Возможные проблемы

### 1. Ошибка "No API key provided"

**Решение**: Проверьте, что в `.env` файле правильно указан `OPENAI_API_KEY`

### 2. Ошибка "Rate limit exceeded"

**Решение**: У вас превышен лимит запросов к OpenAI API. Подождите или обновите план.

### 3. TRAI не отвечает

**Решение**: 
- Проверьте подключение к интернету
- Убедитесь, что backend запущен
- Проверьте логи сервера на ошибки

### 4. Неправильный формат ответа

**Решение**: TRAI автоматически обрабатывает ошибки парсинга и возвращает текстовый ответ.

## 🔄 Обновления и улучшения

### Планируемые функции:

- [ ] Поддержка других языков
- [ ] Сохранение истории проверок TRAI
- [ ] Настройка критериев оценки
- [ ] Экспорт результатов в PDF
- [ ] Интеграция с другими AI моделями

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи backend сервера
2. Убедитесь в правильности переменных окружения
3. Проверьте подключение к OpenAI API
4. Обратитесь к команде разработки

---

**TRAI** - ваш надежный помощник в проверке IELTS Writing! 🎯✨