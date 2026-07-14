import { io } from "socket.io-client";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      autoConnect: false,
      transports: ["websocket"]
    });
    socket.onAny((event, ...args) => {
  console.log("SOCKET EVENT:", event, args);
});
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  console.log("connectSocket() called");
  if (!s.connected && !s.active) {
      console.log("Connecting socket...");
    s.connect();
  }else {
    console.log("Socket already connected");
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinRoom = (roomId) => {
  if (!roomId) return;

  const s = connectSocket();

  console.log("Joining Room:", roomId);

  s.emit("join", roomId);
};

export default getSocket;
