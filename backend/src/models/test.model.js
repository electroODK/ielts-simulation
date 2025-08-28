import mongoose from "mongoose";

const typedQuestionSchema = new mongoose.Schema({
  id: { type: String },
  type: { type: String, enum: ["mcq", "multi", "tf", "short", "gap_text"], default: "short" },
  prompt: { type: String, required: true },
  options: [{ type: String }],
  // correctAnswer can be string | string[] | { [gapId]: string }
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  // for gap_text rendering: content is array of nodes { type: 'text'|'gap', value?: string, id?: string }
  content: [{ type: mongoose.Schema.Types.Mixed }],
}, { _id: false });

const questionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
}, { _id: false });

const listeningPartSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  questions: [typedQuestionSchema],
}, { _id: false });

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  reading: [questionSchema],
  listening: [questionSchema],
  listeningParts: [listeningPartSchema],
  listeningAudioUrl: { type: String, default: "" },
  writingTasks: [{ type: String }],
  speakingTopics: [{ type: String }],
}, { timestamps: true });

const TestModel = mongoose.model("Test", testSchema);
export default TestModel;

