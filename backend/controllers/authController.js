import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import sendEmail from "../utils/sendEmail.js";

// ===============================
// SEND OTP (Login / Register)
// ===============================
export const sendOtp = async (req, res) => {
  console.log("🔥 sendOtp hit");

  try {
    const { email } = req.body;
    console.log("📩 Email received:", email);

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    let user = await User.findOne({ email });

    // 🆕 Auto-register new users
    if (!user) {
      user = await User.create({ email });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = dayjs().add(5, "minute").toDate();
    await user.save();

    console.log("📤 Attempting to send OTP email...");

    // ⏱️ Fail-safe: timeout if email hangs
    await Promise.race([
      sendEmail(
        email,
        "Your Login OTP",
        `Your OTP is ${otp}. It expires in 5 minutes.`
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timeout")), 15000)
      ),
    ]);

    console.log("📬 OTP email sent successfully");

    return res.status(200).json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Send OTP Error:", err);

    // ⚠️ Always respond so request never stays pending
    return res.status(500).json({
      msg: "Failed to send OTP. Please try again later.",
      error: err.message,
    });
  }
};

// ===============================
// VERIFY OTP
// ===============================
export const verifyOtp = async (req, res) => {
  console.log("🔥 verifyOtp hit");

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ msg: "Invalid OTP" });
    }

    if (dayjs().isAfter(user.otpExpires)) {
      return res.status(401).json({ msg: "OTP expired" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // 🔐 JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: { email: user.email },
    });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    return res.status(500).json({
      msg: "OTP verification failed",
      error: err.message,
    });
  }
};
