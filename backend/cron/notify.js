// backend/cron/notify.js
import Agenda from "agenda";
import dayjs from "dayjs";
import Task from "../models/Task.js";
import { sendTelegramMessage } from "../utils/telegram.js";

let agenda;

export async function startAgenda() {
  agenda = new Agenda({
    db: {
      address: process.env.MONGO_URI,
      collection: "agendaJobs",
    },
  });

  await agenda.start();
  console.log("Agenda Started ✔");

  // =====================================================
  // 📌 TASK REMINDER JOB (shared logic)
  // =====================================================
  agenda.define("pending_task_reminder", async () => {
    const today = dayjs().format("YYYY-MM-DD");
    const displayDate = dayjs().format("DD/MM/YYYY");

    const tasks = await Task.find({ date: today, completed: false });

    // 🎉 If ALL tasks are completed → send encouragement ONCE
    if (tasks.length === 0) {
      await sendTelegramMessage(
        `🎉 *Amazing! All tasks for ${displayDate} are completed!*  
Keep up the consistency! 💪🔥`
      );
      return;
    }

    // 📝 Build message
    let msg = `🗓️ *Pending Tasks – ${displayDate}*\n\n`;

    tasks.forEach((t) => {
      const time = dayjs(t.assignedTime).format("hh:mm A");
      msg += `• *${
        t.title
      }* (${t.difficulty.toUpperCase()}) — Assigned at *${time}*\n`;
    });

    await sendTelegramMessage(msg);
  });

  // =====================================================
  // ⏰ MULTIPLE REMINDERS PER DAY
  // =====================================================
  // 4:00 PM
  await agenda.every("0 16 * * *", "pending_task_reminder");

  // 7:00 PM
  await agenda.every("0 19 * * *", "pending_task_reminder");

  // 10:00 PM
  await agenda.every("0 22 * * *", "pending_task_reminder");

  // 11:45 PM (final reminder)
  await agenda.every("57 08 * * *", "pending_task_reminder");

  console.log("Task reminders scheduled at 4 PM, 7 PM, 10 PM, and 11:45 PM ✔");
}
