import express from "express";

const router =
  express.Router();

import protect
from "../middlewares/authMiddleware.js";

import authorizeRoles
from "../middlewares/roleMiddleware.js";

import upload
from "../config/multer.js";

import {

  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  donorStats,
  updateDonationStatus

}
from "../controllers/donationController.js";

import {
  createDonationValidation
}
from "../validators/donationValidator.js";

import validateRequest
from "../middlewares/validateRequest.js";


router.post(

  "/",

  protect,

  authorizeRoles(
    "donor",
    "admin"
  ),

  upload.array(
    "images",
    5
  ),

  createDonationValidation,

  validateRequest,

  createDonation

);



router.get(
  "/",
  getDonations
);


router.get(

  "/stats",

  protect,

  donorStats

);


router.get(

  "/:id",

  getDonationById

);

router.put(

  "/:id",

  protect,

  authorizeRoles(
    "donor",
    "admin"
  ),

  updateDonation

);


router.delete(

  "/:id",

  protect,

  authorizeRoles(
    "donor",
    "admin"
  ),

  deleteDonation

);


router.patch(

  "/:id/status",

  protect,

  authorizeRoles(
    "ngo",
    "volunteer",
    "admin"
  ),

  updateDonationStatus

);

export default router;