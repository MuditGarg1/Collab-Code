import { io } from "socket.io-client";

const ServerUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const socket = io(ServerUrl, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ["websocket", "polling"],
});

export default socket;
