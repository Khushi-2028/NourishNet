import express from "express";

const router = express.Router();

import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getAvailableVolunteers } from "../controllers/volunteerController.js";
import {
  createProfile,
  dashboard
}
from "../controllers/volunteerController.js";

// Create Volunteer Profile
router.post(
  "/profile",
  protect,
  authorizeRoles("volunteer"),
  createProfile
);

// Volunteer Dashboard
router.get(
  "/dashboard",
  protect,
  authorizeRoles("volunteer"),
  dashboard
);
router.get(
  "/available",
  protect,
  authorizeRoles("ngo"),
  getAvailableVolunteers
);


export default router;