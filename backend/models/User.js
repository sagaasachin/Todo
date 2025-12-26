import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },

  // 🔗 Telegram integration
  telegramChatId: { type: String, default: null },

  otp: String,
  otpExpires: Date,
});

export default mongoose.model("User", userSchema);
