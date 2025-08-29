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

export const getTestPublic = async (req, res) => {
  const testId = req.params.id;
  const userId = req.user?.id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.tests.some((t) => String(t) === String(testId))) {
    return res.status(403).json({ message: "Test not assigned" });
  }

  const test = await Test.findById(testId);
  if (!test) return res.status(404).json({ message: "Test not found" });

  // Поддержка как старой, так и новой структуры
  if (test.sections && test.sections.length > 0) {
    // Новая структура с секциями и блоками
    const sanitizeBlock = (block) => {
      const sanitizedBlock = {
        blockType: block.blockType,
        title: block.title,
        instructions: block.instructions
      };

      switch (block.blockType) {
        case 'mcq_group':
        case 'tfng_group':
          sanitizedBlock.questions = (block.questions || []).map(q => ({
            prompt: q.prompt,
            options: q.options || []
          }));
          break;
        
        case 'matching_statements':
          sanitizedBlock.matching = {
            left: block.matching?.left || [],
            right: block.matching?.right || []
          };
          break;
        
        case 'matching_headings_group':
          sanitizedBlock.headings = {
            headings: block.headings?.headings || [],
            items: (block.headings?.items || []).map(item => ({
              prompt: item.prompt
            }))
          };
          break;
        
        case 'table_block':
          sanitizedBlock.table = {
            columns: block.table?.columns || [],
            rows: block.table?.rows || []
          };
          break;
        
        case 'gap_text_block':
          sanitizedBlock.gapText = {
            template: block.gapText?.template || ''
          };
          break;
        
        case 'gap_table_block':
          sanitizedBlock.gapTable = {
            columns: block.gapTable?.columns || [],
            rows: block.gapTable?.rows || []
          };
          break;
        
        case 'writing_part1':
        case 'writing_part2':
          sanitizedBlock.writing = {
            imageUrl: block.writing?.imageUrl,
            prompt: block.writing?.prompt || ''
          };
          break;
        
        case 'speaking_questions':
          sanitizedBlock.speaking = {
            questions: block.speaking?.questions || []
          };
          break;
      }

      return sanitizedBlock;
    };

    const sanitizeSection = (section) => ({
      type: section.type,
      title: section.title,
      durationSec: section.durationSec,
      blocks: (section.blocks || []).map(sanitizeBlock)
    });

    const payload = {
      id: test._id,
      name: test.name,
      description: test.description,
      sections: (test.sections || []).map(sanitizeSection)
    };

    return res.json(payload);
  } else {
    // Старая структура (для обратной совместимости)
    const sanitizeSimpleQuestions = (questions) =>
      questions.map((q) => ({ id: q._id, prompt: q.prompt, options: q.options || [] }));

    const sanitizeTypedQuestions = (questions) =>
      (questions || []).map((q) => ({
        id: q.id || q._id,
        type: q.type,
        prompt: q.prompt,
        options: q.options || [],
        content: q.content || [],
      }));

    const payload = {
      id: test._id,
      name: test.name,
      description: test.description,
      listeningAudioUrl: test.listeningAudioUrl || "",
      listening: sanitizeSimpleQuestions(test.listening || []),
      listeningParts: (test.listeningParts || []).map((p) => ({
        index: p.index,
        audioUrl: p.audioUrl,
        duration: p.duration,
        questions: sanitizeTypedQuestions(p.questions),
      })),
      readingPassages: (test.readingPassages || []).map((rp) => ({
        index: rp.index,
        title: rp.title,
        // content nodes without answers
        content: (rp.content || []).map((n) => n.type === 'gap' ? { type: 'gap', id: n.id } : n),
        questions: sanitizeTypedQuestions(rp.questions),
      })),
    };
    return res.json(payload);
  }
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

export const updateTest = async (req, res) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Test not found' });
    return res.json(updated);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const deleted = await Test.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Test not found' });
    return res.status(204).send();
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

