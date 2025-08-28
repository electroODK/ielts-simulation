import mongoose from "mongoose";

const sectionScoreSchema = new mongoose.Schema({
  band: { type: Number, default: 0 },
  comment: { type: String, default: "" },
}, { _id: false });

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
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

