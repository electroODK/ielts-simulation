import Result from "../models/result.model.js";
import Test from "../models/test.model.js";
import { sendResultToChannel, formatResultMessage } from "../integrations/telegram.js";

export const submitResult = async (req, res) => {
  try {
    const result = await Result.create({ ...req.body, status: "submitted" });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const listResults = async (_req, res) => {
  const results = await Result.find({}).populate("user test").sort({ createdAt: -1 });
  return res.json(results);
};

export const listResultsByUser = async (req, res) => {
  const results = await Result.find({ user: req.params.userId }).populate("test");
  return res.json(results);
};

export const updateResult = async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) return res.status(404).json({ message: "Result not found" });

  const role = req.user?.role;

  if (role === "admin") {
    const { reading, listening, writing, speaking, finalBand, status } = req.body || {};
    if (reading) result.reading = { ...result.reading, ...reading };
    if (listening) result.listening = { ...result.listening, ...listening };
    if (writing) result.writing = { ...result.writing, ...writing };
    if (speaking) result.speaking = { ...result.speaking, ...speaking };
    if (typeof finalBand === 'number') result.finalBand = finalBand;
    if (typeof status === 'string') result.status = status;
  } else if (role === "speaking-checker") {
    const { speaking } = req.body || {};
    if (speaking) {
      result.speaking = { ...result.speaking, ...speaking };
    }
  } else if (role === "writing-checker") {
    const { writing } = req.body || {};
    if (writing) {
      result.writing = { ...result.writing, ...writing };
    }
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }

  await result.save();
  return res.json(result);
};

export const finalizeResult = async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) return res.status(404).json({ message: "Result not found" });
  result.status = "finalized";
  await result.save();
  return res.json(result);
};

export const publishResult = async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) return res.status(404).json({ message: "Result not found" });
  result.status = "published";
  await result.save();
  try {
    const populated = await result.populate(["user", "test"]);
    const message = formatResultMessage(populated);
    await sendResultToChannel(message);
  } catch (e) {
    // ignore if telegram not configured
  }
  return res.json(result);
};

export const submitListeningAnswers = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { testId, answers } = req.body || {};
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "testId and answers are required" });
    }

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const questionsById = new Map(test.listening.map((q) => [String(q._id), q]));
    let correct = 0;
    for (const a of answers) {
      const q = questionsById.get(String(a.questionId));
      if (!q) continue;
      const correctAnswer = (q.correctAnswer || "").trim().toLowerCase();
      const given = String(a.answer ?? "").trim().toLowerCase();
      if (correctAnswer && given && correctAnswer === given) correct += 1;
    }
    const total = test.listening.length || 1;
    const band = Math.round(((correct / total) * 9) * 2) / 2; // half-band rounding

    let result = await Result.findOne({ user: userId, test: testId });
    if (!result) {
      result = await Result.create({ user: userId, test: testId, listening: { band }, status: "submitted" });
    } else {
      result.listening = { ...(result.listening || {}), band };
      if (result.status === "submitted") {
        result.status = "reviewing";
      }
      await result.save();
    }

    return res.json({ correct, total, band, resultId: result._id });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

