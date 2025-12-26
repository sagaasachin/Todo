import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import dayjs from "dayjs";

export default function TaskHistoryTable({ tasks, date }) {
  const displayDate = dayjs(date).format("DD/MM/YYYY");

  const noTasks = tasks.length === 0;

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        {/* Header */}
        <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
          📅 Task History – {displayDate}
        </Typography>

        {/* Show message when no tasks */}
        {noTasks && (
          <Typography
            textAlign="center"
            sx={{
              color: "gray",
              fontSize: "1rem",
              py: 2,
            }}
          >
            No tasks assigned on this date.
          </Typography>
        )}

        {!noTasks && (
          <Box sx={{ width: "100%" }}>
            <Table
              size="small"
              sx={{
                width: "100%",
                tableLayout: "fixed",
                "& th, & td": {
                  padding: "6px",
                  fontSize: { xs: "0.75rem", md: "1rem" },
                  whiteSpace: "normal",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>

                    <TableCell>
                      {task.difficulty.charAt(0).toUpperCase() +
                        task.difficulty.slice(1)}
                    </TableCell>

                    {/* AM/PM format */}
                    <TableCell>
                      {dayjs(task.assignedTime).format("hh:mm A")}
                    </TableCell>

                    <TableCell>
                      {task.completedTime
                        ? dayjs(task.completedTime).format("hh:mm A")
                        : "-"}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: task.completed ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
