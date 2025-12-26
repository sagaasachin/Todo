// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as IOServer } from "socket.io";

import authRoutes from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import { initSockets } from "./sockets/taskSocket.js";
import { startAgenda } from "./cron/notify.js";
import telegramRoutes from "./routes/telegram.js";

dotenv.config();

const app = express();

/* -----------------------------
   CONFIG
----------------------------- */
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.SOCKET_ORIGIN?.split(",") || [
  "http://localhost:5173",
];

/* -----------------------------
   MIDDLEWARES
----------------------------- */
app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* -----------------------------
   HTTP + SOCKET SERVER
----------------------------- */
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Make io available in controllers
app.set("io", io);

/* -----------------------------
   ROUTES
----------------------------- */
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRoutes);
app.use("/api/telegram", telegramRoutes);

/* -----------------------------
   SOCKET HANDLERS
----------------------------- */
initSockets(io);

/* -----------------------------
   DATABASE CONNECTION
----------------------------- */
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", async () => {
  console.log("MongoDB Connected ✔");

  // Start server
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });

  // Start Agenda AFTER Mongo is ready
  await startAgenda();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Error:", err);
});
