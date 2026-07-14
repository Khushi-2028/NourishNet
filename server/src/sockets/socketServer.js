import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
console.log("================================");
console.log("CONNECTED");
console.log(socket.id);
console.log("Connected sockets:"); 
  console.log([...io.sockets.sockets.keys()]);
  console.log("================================");
 
  socket.on("join", (room) => {
    console.log("================================");
    console.log("JOIN EVENT RECEIVED");
    console.log("Room:", room);
    console.log("Socket ID:", socket.id);
    console.log("================================");
    socket.join(room);
    console.log([...io.sockets.adapter.rooms.entries()]);
    console.log("Members in Target Room:");
    console.log(io.sockets.adapter.rooms.get(room));
    console.log(`${socket.id} joined ${room}`);
}); 
    socket.on("join_delivery", (deliveryId) => {
      socket.join(`delivery_${deliveryId}`);
      console.log(`${socket.id} joined delivery_${deliveryId}`);
    });

    socket.on("disconnect", (reason) => {
    console.log("================================");
    console.log("CLIENT DISCONNECTED");
    console.log("Socket:", socket.id);
    console.log("Reason:", reason);
    console.log("Connected sockets after disconnect:");
    console.log([...io.sockets.sockets.keys()]);
    console.log("================================");
    });
  });
};

export const getIO = () => io;