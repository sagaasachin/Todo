import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Force WebSocket for stability
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
