import React from "react";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

export default function CalendarPicker({ value, onChange }) {
  return (
    <TextField
      type="date"
      fullWidth
      label="Date"
      inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
      value={dayjs(value).format("YYYY-MM-DD")}
      onChange={(e) => onChange(new Date(e.target.value))}
      InputLabelProps={{ shrink: true }}
    />
  );
}
