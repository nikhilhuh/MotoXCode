import { Server, Socket } from "socket.io";

export function setUpSocket(io: Server): void {
  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string | undefined;

    console.log(
      `User Connected: ${userId ?? "Unknown"} (Socket ID: ${socket.id})`
    );

    socket.on("disconnect", () => {
      console.log(
        `User Disconnected: ${userId ?? "Unknown"} (Socket ID: ${socket.id})`
      );
    });
  });
}
