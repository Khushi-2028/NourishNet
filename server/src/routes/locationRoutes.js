import express from "express";

const router=express.Router();

import protect from "../middlewares/authMiddleware.js";

import authorizeRoles from "../middlewares/roleMiddleware.js";

import {updateLocation}
from "../controllers/trackingController.js";

router.put(

"/:id",

protect,

authorizeRoles("volunteer"),

updateLocation

);

export default router;