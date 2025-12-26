import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";
import { authApi } from "../authApi";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");

  async function sendOtp() {
    await authApi.post("/send-otp", { email });
    setStep("otp");
  }

  async function verifyOtp() {
    const res = await authApi.post("/verify-otp", { email, otp });
    localStorage.setItem("token", res.data.token);
    onLogin();
  }

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
      <Typography variant="h6" textAlign="center" mb={2}>
        Login
      </Typography>

      {step === "email" ? (
        <>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            onClick={sendOtp}
            variant="contained"
          >
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            onClick={verifyOtp}
            variant="contained"
          >
            Verify & Login
          </Button>
        </>
      )}
    </Card>
  );
}
