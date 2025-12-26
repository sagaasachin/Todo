import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: String,
  difficulty: String,
  date: String,

  assignedTime: Date,
  completedTime: Date,

  completed: { type: Boolean, default: false },

  history: [
    {
      action: String,
      time: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Task", taskSchema);
