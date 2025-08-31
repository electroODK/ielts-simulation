# 🔍 Отладка проблем с Reading и Speaking секциями

## 📋 Что нужно проверить

### 1. **Reading секция**
- [ ] Создается ли Reading секция с `readingParts`?
- [ ] Работает ли `addQuestionToReadingPart`?
- [ ] Отображается ли `renderReadingQuestionEditor`?

### 2. **Speaking секция**
- [ ] Создается ли Speaking секция?
- [ ] Работает ли `addBlock` для `speaking_questions`?
- [ ] Работает ли `addQuestionToSpeakingBlock`?

### 3. **Writing секция**
- [ ] Создается ли Writing секция?
- [ ] Работает ли `addBlock` для `writing_part1` и `writing_part2`?
- [ ] Работает ли `addQuestionToWritingBlock`?

## 🚀 Как тестировать

### Шаг 1: Откройте консоль браузера
1. Откройте TestCreator в браузере
2. Нажмите F12 → Console

### Шаг 2: Создайте Reading секцию
1. Нажмите "Добавить секцию" → "Reading"
2. Проверьте консоль на сообщения от `addSection`
3. Попробуйте добавить вопрос в любую часть
4. Проверьте консоль на сообщения от `addQuestionToReadingPart`

### Шаг 3: Создайте Speaking секцию
1. Нажмите "Добавить секцию" → "Speaking"
2. Проверьте консоль на сообщения от `addSection`
3. Нажмите "Speaking Questions" для добавления блока
4. Проверьте консоль на сообщения от `addBlock`
5. Попробуйте добавить вопрос в блок
6. Проверьте консоль на сообщения от `addQuestionToSpeakingBlock`

### Шаг 4: Создайте Writing секцию
1. Нажмите "Добавить секцию" → "Writing"
2. Проверьте консоль на сообщения от `addSection`
3. Нажмите "Writing Part 1" или "Writing Part 2"
4. Проверьте консоль на сообщения от `addBlock`
5. Попробуйте добавить задание в блок
6. Проверьте консоль на сообщения от `addQuestionToWritingBlock`

## 🐛 Возможные проблемы

### Проблема 1: Функции не вызываются
- **Симптом**: Нет сообщений в консоли
- **Решение**: Проверить, правильно ли подключены обработчики событий

### Проблема 2: Ошибки в консоли
- **Симптом**: Красные ошибки в консоли
- **Решение**: Исправить синтаксические ошибки

### Проблема 3: Данные не обновляются
- **Симптом**: UI не меняется после добавления
- **Решение**: Проверить `setTestData` и `useState`

### Проблема 4: Неправильная структура данных
- **Симптом**: Ошибки типа "Cannot read properties of undefined"
- **Решение**: Проверить инициализацию `readingParts`, `blocks` и т.д.

## 📊 Ожидаемые сообщения в консоли

### При создании Reading секции:
```
addSection called: {sectionType: "reading"}
Current testData: {...}
New section created: {type: "reading", readingParts: [...], ...}
```

### При добавлении вопроса в Reading:
```
addQuestionToReadingPart called: {sectionIndex: 0, partIndex: 0, questionType: "mcq"}
Current testData: {...}
New question created: {...}
Updated sections: [...]
```

### При создании Speaking блока:
```
addBlock called: {sectionIndex: 1, blockType: "speaking_questions"}
Current testData: {...}
New block created: {...}
Updated sections for block: [...]
```

## 🔧 Если ничего не работает

1. **Проверьте синтаксис**: Нет ли ошибок в консоли
2. **Проверьте импорты**: Все ли функции правильно импортированы
3. **Проверьте состояние**: Правильно ли инициализируется `testData`
4. **Проверьте React DevTools**: Состояние компонента в браузере