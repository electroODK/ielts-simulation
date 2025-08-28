import Test from "../models/test.model.js";
import User from "../models/user.model.js";

export const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    return res.status(201).json(test);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const listTests = async (_req, res) => {
  const tests = await Test.find({}).sort({ createdAt: -1 });
  return res.json(tests);
};

export const getTest = async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) return res.status(404).json({ message: "Test not found" });
  return res.json(test);
};

export const assignTest = async (req, res) => {
  const { userId, testId } = req.body;
  const user = await User.findById(userId);
  const test = await Test.findById(testId);
  if (!user || !test) return res.status(404).json({ message: "User or Test not found" });

  if (!user.tests.some((t) => t.equals(test._id))) {
    user.tests.push(test._id);
    user.status = "ready";
    await user.save();
  }

  return res.json({ message: "Assigned" });
};

