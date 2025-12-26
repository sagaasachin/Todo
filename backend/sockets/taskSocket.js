export function initSockets(io) {
  io.on("connection", (socket) => {
    // console.log("Client connected");

    socket.on("taskUpdated", () => {
      io.emit("tasks:update");
    });

    socket.on("disconnect", () => {
    //   console.log("Client disconnected");
    });
  });
}
