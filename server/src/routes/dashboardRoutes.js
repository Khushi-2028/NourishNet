import express from "express";

const router = express.Router();

import protect from "../middlewares/authMiddleware.js";

import {

    ngoDashboard,

    activeDeliveries,

    trackingHistory,

    analytics

} from "../controllers/dashboardController.js";

/*
=========================================
NGO Dashboard
=========================================
*/

router.get(

    "/ngo",

    protect,

    ngoDashboard

);

/*
=========================================
Active Deliveries
=========================================
*/

router.get(

    "/active-deliveries",

    protect,

    activeDeliveries

);

/*
=========================================
Tracking History
=========================================
*/

router.get(

    "/tracking/:deliveryId",

    protect,

    trackingHistory

);

/*
=========================================
Platform Analytics
=========================================
*/

router.get(

    "/analytics",

    protect,

    analytics

);

export default router;