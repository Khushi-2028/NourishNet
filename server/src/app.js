import cors from "cors";
import express from "express";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pickupRoutes from "./routes/pickupRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import {swaggerUi,specs} from "./docs/swagger.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// Serve uploads from BOTH locations
// ==========================================

// Primary uploads folder
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// Legacy uploads folder (used by report module)
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

console.log(
  "Serving uploads from:",
  path.join(process.cwd(), "uploads")
);

console.log(
  "Serving legacy uploads from:",
  path.join(__dirname, "uploads")
);
app.get("/test-upload", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "uploads",
            "donations",
            "1783780419315-brownie.jpg"
        )
    );
});
console.log(
  "Serving uploads from:",
  path.join(process.cwd(), "uploads")
);

app.get("/", (req, res) => {
res.json({
      message:
      "Smart Food API Running"
});});

app.use(
  "/api/auth",authRoutes
);

app.use(
  "/api/donations",donationRoutes
);

app.use(
"/api-docs",
swaggerUi.serve,
 swaggerUi.setup(specs)
);

app.use(
  "/api/ngo", ngoRoutes
);

app.use(
  "/api/pickups",pickupRoutes
);

app.use(
 "/api/volunteers",volunteerRoutes
);

app.use(
 "/api/deliveries",deliveryRoutes
);

app.use(
"/api/tracking",trackingRoutes
);

app.use(
"/api/notifications",notificationRoutes
);

app.use(
    "/api/dashboard",dashboardRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use("/api/users", userRoutes);
app.use("/api/location",locationRoutes);

app.use("/api/public", publicRoutes);

app.use(
  errorHandler
);
export default app;