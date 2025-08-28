import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listeningTest: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  readingTest: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  writingTest: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  speakingTest: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  status: { type: String, enum: ["assigned", "in_progress", "submitted"], default: "assigned" },
}, { timestamps: true });

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);
export default AssignmentModel;

