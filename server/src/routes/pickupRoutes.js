import express from "express";

const router = express.Router();

import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

import {
  createPickupRequest,
  getNgoPickupRequests
} from "../controllers/pickupController.js";

/*
==========================================
CREATE PICKUP REQUEST
==========================================
*/

router.post(
  "/:donationId",
  protect,
  authorizeRoles("ngo"),
  createPickupRequest
);

/*
==========================================
GET ALL PICKUP REQUESTS OF NGO
==========================================
*/

router.get(
  "/my-requests",
  protect,
  authorizeRoles("ngo"),
  getNgoPickupRequests
);

export default router;