import { Server } from "socket.io";
import { setUpSocket } from "./socketHandler";

let io: Server;

const FRONTEND_URL: string = process.env.FRONTEND_URL || "http://localhost:5173";

export function setupSocket(server: any): void {
  io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
    },
  });

  setUpSocket(io);

  console.log("Socket.IO setup complete");
}

export { io };
