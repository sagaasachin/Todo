import User from "../models/User.js";

// Telegram webhook
export const telegramWebhook = async (req, res) => {
  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text;

  // Expect: /start email@example.com
  if (text?.startsWith("/start")) {
    const email = text.split(" ")[1];

    if (!email) {
      return res.send("❌ Send: /start your@email.com");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send("❌ Email not found in app");
    }

    user.telegramChatId = chatId;
    await user.save();

    return res.send("✅ Telegram connected successfully!");
  }

  res.send("ℹ️ Use /start your@email.com");
};
