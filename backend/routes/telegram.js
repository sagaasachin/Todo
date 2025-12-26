import express from "express";
import { telegramWebhook } from "../controllers/telegramController.js";

const router = express.Router();

router.post("/webhook", telegramWebhook);

export default router;
