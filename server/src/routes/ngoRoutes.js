import express from "express";

const router = express.Router();

import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

import {

  createNgoProfile,
  availableDonations,
  acceptDonation,
  rejectDonation,
  ngoStats

}
from "../controllers/ngoController.js";


router.post(
  "/profile",
  protect,
  authorizeRoles("ngo"),
  createNgoProfile
);

router.get(
  "/available-donations",
  protect,
  authorizeRoles("ngo"),
  availableDonations
);

router.post(
  "/accept/:id",
  protect,
  authorizeRoles("ngo"),
  acceptDonation
);

router.post(
  "/reject/:id",
  protect,
  authorizeRoles("ngo"),
  rejectDonation
);

router.get(
  "/stats",
  protect,
  authorizeRoles("ngo"),
  ngoStats
);

export default router;