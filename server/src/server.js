
import "dotenv/config";

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/socketServer.js";
import "./jobs/reservationCleanup.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`NourishNet server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start NourishNet server:", error);
    process.exit(1);
  }
};

startServer();
