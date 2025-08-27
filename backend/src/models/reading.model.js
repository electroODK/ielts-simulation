const readingSchema = new mongoose.Schema({
  passage: String, // текст пассажа
  tasks: [
    {
      type: { type: String, required: true }, // например: "multiple-choice", "true-false", "matching-headings", "fill-gaps"

      question: String, // вопрос (если один)
      options: [String], // варианты (для multiple-choice)
      correctAnswer: String, // правильный ответ (или массив)
      
      // для более сложных заданий можно хранить данные в content
      content: mongoose.Schema.Types.Mixed // JSON с кастомной структурой
    }
  ]
});
const ReadingModel = mongoose.model("Reading", readingSchema);
export default ReadingModel;