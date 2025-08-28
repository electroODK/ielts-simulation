function convertListening(correctAnswers) {
  if (correctAnswers >= 39) return 9;
  if (correctAnswers >= 37) return 8.5;
  if (correctAnswers >= 35) return 8;
  if (correctAnswers >= 32) return 7.5;
  if (correctAnswers >= 30) return 7;
  if (correctAnswers >= 26) return 6.5;
  if (correctAnswers >= 23) return 6;
  if (correctAnswers >= 18) return 5.5;
  if (correctAnswers >= 16) return 5;
  if (correctAnswers >= 13) return 4.5;
  if (correctAnswers >= 10) return 4;
  if (correctAnswers >= 6) return 3.5;
  if (correctAnswers >= 3) return 3;
  if (correctAnswers >= 1) return 2.5;
  return 0;
}
function convertReading(correctAnswers) {
  if (correctAnswers >= 39) return 9;
  if (correctAnswers >= 37) return 8.5;
  if (correctAnswers >= 35) return 8;
  if (correctAnswers >= 33) return 7.5;
  if (correctAnswers >= 30) return 7;
  if (correctAnswers >= 27) return 6.5;
  if (correctAnswers >= 23) return 6;
  if (correctAnswers >= 19) return 5.5;
  if (correctAnswers >= 15) return 5;
  if (correctAnswers >= 13) return 4.5;
  if (correctAnswers >= 10) return 4;
  if (correctAnswers >= 8) return 3.5;
  if (correctAnswers >= 6) return 3;
  if (correctAnswers >= 3) return 2.5;
  return 0;
}
export { convertListening, convertReading };