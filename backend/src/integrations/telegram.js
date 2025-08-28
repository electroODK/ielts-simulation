const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID; // e.g. -1001234567890

export const sendResultToChannel = async (message) => {
  if (!BOT_TOKEN || !CHANNEL_ID) {
    // not configured; skip silently
    return { skipped: true };
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = { chat_id: CHANNEL_ID, text: message, parse_mode: "HTML" };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export const formatResultMessage = (result) => {
  const user = result.user?.username || result.user?.id || "User";
  const testName = result.test?.name || "Test";
  const speaking = result.speaking?.band ?? 0;
  const writing = result.writing?.band ?? 0;
  const listening = result.listening?.band ?? 0;
  const reading = result.reading?.band ?? 0;
  const finalBand = result.finalBand ?? 0;
  return [
    `<b>Result published</b>`,
    `User: <code>${user}</code>`,
    `Test: <code>${testName}</code>`,
    `Reading: <b>${reading}</b> | Listening: <b>${listening}</b>`,
    `Writing: <b>${writing}</b> | Speaking: <b>${speaking}</b>`,
    `Final: <b>${finalBand}</b>`,
  ].join("\n");
};

