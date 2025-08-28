import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Reading (авто)
  reading: {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Reading", required: true },
    userAnswers: [{ type: String, maxlength: 40 }],
    score: { type: Number, default: 0 }
  },

  // Listening (авто)
  listening: {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Listening", required: true },
    userAnswers: [{ type: String, maxlength: 40 }],
    score: { type: Number, default: 0 }
  },

  // Writing (ручная проверка)
  writing: {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Writing", required: true },
    userTexts: [{ type: String, maxlength: 2 }], // Task 1 и Task 2
    score: { type: Number, default: 0 },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // кто проверил
    gradedAt: { type: Date }
  },

  // Speaking (ручная проверка)
  speaking: {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Speaking", required: true },
    userTopics: [{ type: String, maxlength: 2 }], // ответы на 2 топика
    score: { type: Number, default: 0 },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    gradedAt: { type: Date }
  },

  // Общий балл
  overallScore: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

const ResultModel = mongoose.model("Result", resultSchema);

export default ResultModel;

