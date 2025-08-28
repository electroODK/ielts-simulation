import Result from "../models/result.model.js";
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

