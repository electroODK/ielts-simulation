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

export const submitReadingAnswers = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { testId, answers } = req.body || {};
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "testId and answers are required" });
    }

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const flatQuestions = [];
    (test.readingPassages || []).forEach((rp) => {
      (rp.questions || []).forEach((q) => flatQuestions.push(q));
    });
    const questionsById = new Map(flatQuestions.map((q) => [String(q.id || q._id), q]));

    let correct = 0;
    for (const a of answers) {
      const q = questionsById.get(String(a.questionId));
      if (!q) continue;
      const type = q.type;
      const right = q.correctAnswer;
      const given = a.answer;
      if (type === 'mcq' || type === 'tf' || type === 'short') {
        const r = String(right || '').trim().toLowerCase();
        const g = String(given || '').trim().toLowerCase();
        if (r && g && r === g) correct += 1;
      } else if (type === 'multi') {
        const rset = new Set((right || []).map((v)=>String(v).toLowerCase()));
        const gset = new Set((Array.isArray(given) ? given : []).map((v)=>String(v).toLowerCase()));
        if (rset.size === gset.size && [...rset].every((v)=>gset.has(v))) correct += 1;
      } else if (type === 'gap_text') {
        const rObj = right || {};
        const gObj = given || {};
        const allKeys = Object.keys(rObj);
        const allCorrect = allKeys.length > 0 && allKeys.every((k)=>{
          const r = String(rObj[k] || '').trim().toLowerCase();
          const g = String(gObj[k] || '').trim().toLowerCase();
          return r && g && r === g;
        });
        if (allCorrect) correct += 1;
      }
    }

    const total = flatQuestions.length || 1;
    const band = Math.round(((correct / total) * 9) * 2) / 2;

    let result = await Result.findOne({ user: userId, test: testId });
    if (!result) {
      result = await Result.create({ user: userId, test: testId, reading: { band }, status: "submitted" });
    } else {
      result.reading = { ...(result.reading || {}), band };
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

export const submitWriting = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { testId, task1Text, task2Text, task1ImageRef } = req.body || {};
    if (!testId) return res.status(400).json({ message: "testId is required" });
    let result = await Result.findOne({ user: userId, test: testId });
    if (!result) {
      result = await Result.create({ user: userId, test: testId, status: "submitted" });
    }
    result.writingSubmission = {
      ...(result.writingSubmission || {}),
      task1Text: task1Text || result.writingSubmission?.task1Text || "",
      task2Text: task2Text || result.writingSubmission?.task2Text || "",
      task1ImageRef: task1ImageRef || result.writingSubmission?.task1ImageRef || "",
    };
    if (result.status === "submitted") result.status = "reviewing";
    await result.save();
    return res.json({ ok: true, resultId: result._id });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

