import { io } from "socket.io-client";
import { getUserId } from "../utils/getUserId";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
let userId: string = getUserId();

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  query: { userId },
});

export default socket;
