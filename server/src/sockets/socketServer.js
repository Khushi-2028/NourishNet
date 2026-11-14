
import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("================================");
    console.log("CLIENT CONNECTED");
    console.log("Socket ID:", socket.id);
    console.log("Connected sockets:");
    console.log([...io.sockets.sockets.keys()]);
    console.log("================================");

    socket.on("join", (room) => {
      if (typeof room !== "string" || !room.trim()) {
        return;
      }

      console.log("================================");
      console.log("JOIN EVENT RECEIVED");
      console.log("Room:", room);
      console.log("Socket ID:", socket.id);
      console.log("================================");

      socket.join(room);

      console.log("Members in Target Room:");
      console.log(io.sockets.adapter.rooms.get(room));
      console.log(`${socket.id} joined ${room}`);
    });

    socket.on("join_delivery", (deliveryId) => {
      if (!deliveryId) return;

      const room = `delivery_${deliveryId}`;

      socket.join(room);

      console.log(`${socket.id} joined ${room}`);
    });

    socket.on("disconnect", (reason) => {
      console.log("================================");
      console.log("CLIENT DISCONNECTED");
      console.log("Socket:", socket.id);
      console.log("Reason:", reason);
      console.log("================================");
    });
  });

  return io;
};

export const getIO = () => io;
