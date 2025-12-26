import nodemailer from "nodemailer";

// Create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Verify transporter at startup
transporter.verify((err) => {
  if (err) {
    console.error("❌ Mail transporter error:", err.message);
  } else {
    console.log("✅ Mail transporter ready");
  }
});

export default async function sendEmail(to, subject, text) {
  try {
    return await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
}
