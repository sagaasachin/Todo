import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
