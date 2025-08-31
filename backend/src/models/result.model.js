import mongoose from "mongoose";

const sectionScoreSchema = new mongoose.Schema({
  band: { type: Number, default: 0 },
  comment: { type: String, default: "" },
}, { _id: false });

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  
  // Секции с детальными результатами
  sections: [{
    type: { type: String, enum: ['listening', 'reading', 'writing', 'speaking'], required: true },
    overallGrade: { type: Number, min: 0, max: 9 },
    status: { type: String, enum: ['pending', 'graded', 'finalized'], default: 'pending' },
    gradedAt: { type: Date },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // Для Speaking секции
    questions: [{
      id: String,
      prompt: String,
      instructions: String,
      audioUrl: String,
      grade: { type: Number, min: 0, max: 9 },
      gradedAt: { type: Date },
      gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      feedback: String
    }],
    
    // Для Writing секции
    task1Text: String,
    task1ImageRef: String,
    task2Text: String,
    
    // Для Listening и Reading секций
    answers: [{
      questionId: String,
      userAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      score: Number
    }]
  }],
  
  // Устаревшие поля (для обратной совместимости)
  reading: sectionScoreSchema,
  listening: sectionScoreSchema,
  writing: sectionScoreSchema,
  speaking: sectionScoreSchema,
  
  writingSubmission: {
    task1Text: { type: String, default: "" },
    task1ImageRef: { type: String, default: "" },
    task2Text: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  
  speakingSubmission: {
    recordings: [{ url: String, duration: Number, size: Number }],
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  
  finalBand: { type: Number, default: 0 },
  status: { type: String, enum: ["submitted", "reviewing", "finalized", "published"], default: "submitted" },
}, { timestamps: true });

const ResultModel = mongoose.model("Result", resultSchema);
export default ResultModel;

