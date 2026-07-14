import express from "express";
const router = express.Router();
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import checkDeliveryOwnership from "../middlewares/checkDeliveryOwnership.js";
import {
    updateLocation,
    getTrackingHistory,
    getCurrentETA,
    getActiveDeliveries,
    getDeliveryTracking
} from "../controllers/trackingController.js";

//Update Live Location
router.put("/location/:deliveryId",
protect,authorizeRoles("volunteer"),
 checkDeliveryOwnership, updateLocation);
router.get(
  "/delivery/:deliveryId",
  protect,
  getDeliveryTracking
);

//Tracking History
router.get("/history/:deliveryId",
protect,getTrackingHistory);

//Current ETA
router.get( "/eta/:deliveryId", protect,
 getCurrentETA);

//Volunteer Active Deliveries
router.get("/active",protect,
 authorizeRoles("volunteer"), getActiveDeliveries);

export default router;