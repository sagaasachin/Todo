import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";

import { api } from "../api";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

// 📅 MUI Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// 🔌 Socket
import { socket } from "../socket";

// 📋 Tables
import TaskAssignedTable from "./TaskAssignedTable";
import TaskHistoryTable from "./TaskHistoryTable";

export default function TodoApp() {
  const [inputs, setInputs] = useState({
    simple: "",
    medium: "",
    hard: "",
  });

  const [tasks, setTasks] = useState([]);
  const [historyDate, setHistoryDate] = useState(new Date());
  const [historyTasks, setHistoryTasks] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // 🕒 Live Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔐 Decode JWT → User Email
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserEmail(decoded.email);
    }
  }, []);

  // 🚪 Logout
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  // 📥 Fetch Today Tasks
  async function fetchTasks() {
    try {
      const res = await api.get("/");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  // 📜 Fetch History
  async function fetchHistory() {
    try {
      const d = dayjs(historyDate).format("YYYY-MM-DD");
      const res = await api.get(`/history?date=${d}`);
      setHistoryTasks(res.data);
    } catch (err) {
      console.error("History error:", err);
      setHistoryTasks([]);
    }
  }

  // Initial Load
  useEffect(() => {
    fetchTasks();
    fetchHistory();
  }, []);

  // Refetch history on date change
  useEffect(() => {
    fetchHistory();
  }, [historyDate]);

  // 🔄 Socket updates
  useEffect(() => {
    socket.on("tasks:update", () => {
      fetchTasks();
      fetchHistory();
    });
    return () => socket.off("tasks:update");
  }, []);

  const isDisabled = (type) => tasks.some((t) => t.difficulty === type);

  async function addTask(type) {
    await api.post("/", { title: inputs[type], difficulty: type });
    setInputs({ ...inputs, [type]: "" });
    fetchTasks();
  }

  const assignedTasks = tasks.filter((t) => !t.completed);

  return (
    <Box width="100%" py={3}>
      {/* ================= USER BAR ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography fontWeight="bold">
              👤 Logged in as:{" "}
              <span style={{ color: "#1976d2" }}>{userEmail}</span>
            </Typography>

            <Stack direction="row" spacing={1}>
              {/* TELEGRAM */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<TelegramIcon />}
                onClick={() =>
                  window.open(
                    "https://t.me/DailyTask12_bot?start=web_login",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                sx={{
                  textTransform: "none",
                  borderColor: "#229ED9",
                  color: "#229ED9",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                Connect Telegram
              </Button>

              {/* LOGOUT */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ================= CLOCK ================= */}
      <Box textAlign="center" mb={3}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, fontSize: { xs: "1.6rem", md: "2.4rem" } }}
        >
          {dayjs(currentTime).format("dddd, MMM DD, YYYY")}
        </Typography>

        <Typography
          sx={{
            fontWeight: 900,
            color: "#1976d2",
            fontSize: { xs: "1.4rem", md: "2rem" },
          }}
        >
          {dayjs(currentTime).format("hh:mm:ss A")}
        </Typography>
      </Box>

      {/* ================= ADD TASK ================= */}
      <Card elevation={4} sx={{ mb: 4 }}>
        <CardContent>
          <Typography textAlign="center" variant="h6" mb={2} fontWeight="bold">
            Add Today’s Tasks
          </Typography>

          <Grid container spacing={2}>
            {["simple", "medium", "hard"].map((level) => (
              <Grid
                key={level}
                xs={12}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label={`${
                    level.charAt(0).toUpperCase() + level.slice(1)
                  } Task`}
                  value={inputs[level]}
                  onChange={(e) =>
                    setInputs({ ...inputs, [level]: e.target.value })
                  }
                  disabled={isDisabled(level)}
                />

                <Button
                  variant="contained"
                  size="small"
                  disabled={!inputs[level] || isDisabled(level)}
                  onClick={() => addTask(level)}
                  sx={{ fontWeight: "bold" }}
                >
                  ADD
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* ================= ASSIGNED TASKS ================= */}
      <TaskAssignedTable tasks={assignedTasks} refresh={fetchTasks} />

      {/* ================= HISTORY CALENDAR ================= */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography
            textAlign="center"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: "1.1rem" }}
          >
            📅 View Task History
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" justifyContent="center">
              <DatePicker
                label="Select Date"
                value={dayjs(historyDate)}
                disableFuture
                onChange={(newValue) => {
                  if (newValue) {
                    setHistoryDate(newValue.toDate());
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 220 },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
        </CardContent>
      </Card>

      {/* ================= HISTORY TABLE ================= */}
      <TaskHistoryTable tasks={historyTasks} date={historyDate} />
    </Box>
  );
}
