import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import "./jobs/reservationCleanup.js";

connectDB();

const PORT = process.env.PORT || 5000;

import http from "http";
import { initializeSocket }
from "./sockets/socketServer.js";

const server=http.createServer(app);

initializeSocket(server);

server.listen(PORT,()=>{

console.log(`Server running ${PORT}`);

});