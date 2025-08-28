import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
}, { _id: false });

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  reading: [questionSchema],
  listening: [questionSchema],
  listeningAudioUrl: { type: String, default: "" },
  writingTasks: [{ type: String }],
  speakingTopics: [{ type: String }],
}, { timestamps: true });

const TestModel = mongoose.model("Test", testSchema);
export default TestModel;

