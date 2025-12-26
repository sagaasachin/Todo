import mongoose from "mongoose";

const DailyStatusSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  congratsSent: { type: Boolean, default: false },
});

export default mongoose.model("DailyStatus", DailyStatusSchema);