import express from "express";
import auth from "../middleware/auth.js";
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  getHistoryByDate,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(auth); // 🔒 PROTECT ALL TASK ROUTES

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.put("/:id/complete", completeTask);
router.delete("/:id", deleteTask);
router.get("/history", getHistoryByDate);

export default router;
