import axios from "axios";

export async function sendTelegramMessage(chatId, text) {
  if (!chatId) return;

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  });
}
