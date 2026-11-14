
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pickupRoutes from "./routes/pickupRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { swaggerUi, specs } from "./docs/swagger.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (for example, server-to-server requests).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

// ==========================================
// STATIC UPLOADS
// ==========================================

// Primary uploads folder
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Legacy uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

console.log(
  "Serving uploads from:",
  path.join(process.cwd(), "uploads")
);

console.log(
  "Serving legacy uploads from:",
  path.join(__dirname, "uploads")
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Smart Food API Running",
    status: "success",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/donations", donationRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/ngo", ngoRoutes);

app.use("/api/pickups", pickupRoutes);

app.use("/api/volunteers", volunteerRoutes);

app.use("/api/deliveries", deliveryRoutes);

app.use("/api/tracking", trackingRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/users", userRoutes);

app.use("/api/location", locationRoutes);

app.use("/api/public", publicRoutes);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(errorHandler);

export default app;
