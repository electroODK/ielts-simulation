import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkIELTS() {
  const response = await openai.responses.create({
    model: process.env.AI_MODEL,
    input: `проверь это IELTS Writing task и дай оценку:
    Dear Mr. Smith,
    I have received your letter of complaint regarding poor service...`
  });

  console.log(response.output[0].content[0].text);
}

checkIELTS();
