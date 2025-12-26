import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import sendEmail from "../utils/sendEmail.js";

// ===============================
// SEND OTP (Login / Register)
// ===============================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email required" });

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

    // 📧 Send Email (SUBJECT + MESSAGE)
    await sendEmail(
      email,
      "Your Login OTP",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// VERIFY OTP
// ===============================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp) return res.status(401).json({ msg: "Invalid OTP" });

    if (dayjs().isAfter(user.otpExpires))
      return res.status(401).json({ msg: "OTP expired" });

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // 🔐 JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: { email: user.email },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
};
