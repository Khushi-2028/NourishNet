import express from "express";
const router = express.Router();
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import checkDeliveryOwnership from "../middlewares/checkDeliveryOwnership.js";
import {
assignVolunteer,acceptTask,pickupFood,
startTransit,completeDelivery,uploadDeliveryProof,
confirmDelivery,getDeliveryById
}
from "../controllers/deliveryController.js";
import uploadProof from "../middlewares/uploadProof.js";
// NGO assigns volunteer
router.post(
  "/assign/:pickupId",
  protect,
  authorizeRoles("ngo"),
  assignVolunteer
);
// Volunteer accepts task
router.put(
  "/accept/:id",
  protect,
  authorizeRoles("volunteer"),
  checkDeliveryOwnership,
  acceptTask
);
// Volunteer picks food
router.put(
  "/pickup/:id",
  protect,
  authorizeRoles("volunteer"),
  checkDeliveryOwnership,
  pickupFood
);
// Start transit
router.put(
  "/transit/:id",
  protect,
  authorizeRoles("volunteer"),
  checkDeliveryOwnership,
  startTransit
);
// Complete delivery
router.put(
  "/complete/:id",
  protect,
  authorizeRoles("volunteer"),
  checkDeliveryOwnership,
  completeDelivery
);
router.post(
    "/:id/proof",
    protect,
    authorizeRoles("volunteer"),
    checkDeliveryOwnership,
    uploadProof.single("proofImage"),
    uploadDeliveryProof
);
router.put(
    "/:id/confirm",
    protect,
    authorizeRoles("ngo"),
    confirmDelivery
);
router.get(
    "/:id",
    protect,
    getDeliveryById
);
export default router;