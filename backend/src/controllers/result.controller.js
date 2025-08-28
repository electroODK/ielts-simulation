// controllers/resultController.js
const Result = require("../models/result");
const { convertListening, convertReading } = require("../utils/converters");

function roundIELTS(score) {
  const floor = Math.floor(score);
  const decimal = score - floor;

  if (decimal < 0.25) return floor;          // до .25 → вниз
  if (decimal < 0.75) return floor + 0.5;    // от .25 до .75 (не включая .75) → .5
  return floor + 1;                          // .75 и выше → вверх
}

exports.getResult = async (req, res) => {
  try {
    const userId = req.check.user.id;

    // ищем запись по юзеру
    const result = await Result.findOne({ user: userId });
    if (!result) {
      return res.status(404).json({ message: "Результат не найден" });
    }

    // авто-конвертация Listening и Reading
    const listeningScore = convertListening(result.listeningRaw);
    const readingScore = convertReading(result.readingRaw);

    // проверяем, есть ли Speaking и Writing
    if (
      result.speakingScore === undefined ||
      result.writingScore === undefined
    ) {
      return res.status(400).json({
        message: "Ожидание оценки Speaking и Writing экзаменатором",
        listening: listeningScore,
        reading: readingScore,
      });
    }

    const { speakingScore, writingScore } = result;

    // считаем среднее
    const avg =
      (listeningScore + readingScore + speakingScore + writingScore) / 4;

    const overall = roundIELTS(avg);

    res.json({
      listening: listeningScore,
      reading: readingScore,
      speaking: speakingScore,
      writing: writingScore,
      overall,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
