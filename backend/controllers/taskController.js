import Task from "../models/Task.js";
import User from "../models/User.js";
import dayjs from "dayjs";
import { sendTelegramMessage } from "../utils/telegram.js";

/**
 * Helper: safely add history
 */
async function safeAddHistory(task, action) {
  if (typeof task.addHistory === "function") {
    await task.addHistory(action);
  } else {
    task.history = task.history || [];
    task.history.push({ action, at: new Date() });
  }
}

/* =====================================================
   GET TODAY'S TASKS (LOGGED-IN USER ONLY)
===================================================== */
export const getTasks = async (req, res) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    const tasks = await Task.find({
      user: req.user.id,
      date: today,
    }).sort({ assignedTime: 1 });

    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

/* =====================================================
   CREATE TASK (LOGGED-IN USER ONLY)
===================================================== */
export const createTask = async (req, res) => {
  try {
    const { title, difficulty } = req.body;
    const today = dayjs().format("YYYY-MM-DD");

    const task = await Task.create({
      user: req.user.id,
      title,
      difficulty,
      date: today,
      assignedTime: new Date(),
      history: [{ action: "created", at: new Date() }],
    });

    res.json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

/* =====================================================
   UPDATE TASK (OWNER ONLY)
===================================================== */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    task.title = req.body.title;
    await safeAddHistory(task, "edited");
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

/* =====================================================
   COMPLETE TASK (OWNER ONLY + TELEGRAM)
===================================================== */
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    task.completed = true;
    task.completedTime = new Date();
    await safeAddHistory(task, "completed");
    await task.save();

    // 🔍 Check if user has any pending tasks today
    const today = dayjs().format("YYYY-MM-DD");
    const pendingCount = await Task.countDocuments({
      user: req.user.id,
      date: today,
      completed: false,
    });

    // 🎉 Send Telegram ONLY to this user
    if (pendingCount === 0) {
      const user = await User.findById(req.user.id);

      if (user?.telegramChatId) {
        const displayDate = dayjs().format("DD/MM/YYYY");

        await sendTelegramMessage(
          user.telegramChatId,
          `🎉 Fantastic Work!\nYou completed all tasks for ${displayDate}! 🚀🔥`
        );
      }
    }

    res.json(task);
  } catch (err) {
    console.error("Complete task error:", err);
    res.status(500).json({ error: "Failed to complete task" });
  }
};

/* =====================================================
   DELETE TASK (OWNER ONLY)
===================================================== */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await safeAddHistory(task, "deleted");
    await Task.findByIdAndDelete(task._id);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

/* =====================================================
   TASK HISTORY BY DATE (USER ONLY)
===================================================== */
export const getHistoryByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const tasks = await Task.find({
      user: req.user.id,
      date,
    }).sort({ assignedTime: 1 });

    res.json(tasks);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
