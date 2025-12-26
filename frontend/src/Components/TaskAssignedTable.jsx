import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Button,
  TextField,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { api } from "../api";

export default function TaskAssignedTable({ tasks, refresh }) {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  async function saveTask(id) {
    await api.put(`/${id}`, { title: editValue });
    setEditId(null);
    refresh();
  }

  async function deleteTask(id) {
    await api.delete(`/${id}`);
    refresh();
  }

  async function completeTask(id) {
    await api.put(`/${id}/complete`);
    refresh();
  }

  const noTasks = tasks.length === 0;

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Assigned Tasks
        </Typography>

        {/* No active tasks */}
        {noTasks && (
          <Typography
            textAlign="center"
            sx={{
              color: "green",
              fontWeight: "bold",
              py: 2,
            }}
          >
            All tasks for today are completed! 🎉
          </Typography>
        )}

        {!noTasks && (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>
                      {editId === task._id ? (
                        <TextField
                          size="small"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      ) : (
                        task.title
                      )}
                    </TableCell>

                    <TableCell>
                      {task.difficulty.charAt(0).toUpperCase() +
                        task.difficulty.slice(1)}
                    </TableCell>

                    {/* ⏱ AM/PM */}
                    <TableCell>
                      {dayjs(task.assignedTime).format("hh:mm A")}
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {editId === task._id ? (
                          <Button variant="contained" size="small">
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setEditId(task._id);
                              setEditValue(task.title);
                            }}
                          >
                            Edit
                          </Button>
                        )}

                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => completeTask(task._id)}
                        >
                          Complete
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete
                        </Button>
                      </Box>
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
