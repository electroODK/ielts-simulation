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

const readingPassageSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  title: { type: String, default: "" },
  content: [{ type: mongoose.Schema.Types.Mixed }],
  questions: [typedQuestionSchema],
}, { _id: false });

// Flexible builder blocks for admin
const blockSchema = new mongoose.Schema({
  blockType: {
    type: String,
    enum: [
      "mcq_group",
      "tfng_group",
      "matching_statements",
      "matching_headings_group",
      "table_block",
      "gap_text_block",
      "gap_table_block",
    ],
    required: true,
  },
  title: { type: String, default: "" },
  instructions: { type: String, default: "" },
  // For mcq/tfng groups: [{ prompt, options, answerKey }]
  questions: [{ type: mongoose.Schema.Types.Mixed }],
  // For matching: { left: [String], right: [String] }
  matching: { type: mongoose.Schema.Types.Mixed },
  // For headings: { headings: [String], items: [{ prompt, answerKey }] }
  headings: { type: mongoose.Schema.Types.Mixed },
  // For table: { columns: [String], rows: [String], allowed: [[Boolean]], answers: Mixed }
  table: { type: mongoose.Schema.Types.Mixed },
  // For gap_text: { template: String }
  gapText: { type: mongoose.Schema.Types.Mixed },
  // For gap_table: { columns: [String], rows: [String], templateCells: [[String|null]] }
  gapTable: { type: mongoose.Schema.Types.Mixed },
}, { _id: false, strict: false });

const testSectionSchema = new mongoose.Schema({
  type: { type: String, enum: ["listening","reading","writing","speaking"], required: true },
  title: { type: String, default: "" },
  durationSec: { type: Number, default: 0 },
  audioParts: [listeningPartSchema],
  blocks: [blockSchema],
}, { _id: false });

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  reading: [questionSchema],
  readingPassages: [readingPassageSchema],
  listening: [questionSchema],
  listeningParts: [listeningPartSchema],
  listeningAudioUrl: { type: String, default: "" },
  writingTasks: [{ type: String }],
  speakingTopics: [{ type: String }],
  sections: [testSectionSchema],
}, { timestamps: true });

const TestModel = mongoose.model("Test", testSchema);
export default TestModel;

