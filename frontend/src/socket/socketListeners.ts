import { Socket } from "socket.io-client";

export const socketListeners = (socket: Socket) => {
  socket.on("connect", () => {
    console.log("✅ Socket connected with ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.warn("⚠️ Socket disconnected");
  });
};
