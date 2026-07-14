import express from "express";

const router = express.Router();

import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

import { getDashboard, getUsers, getUserById,
      updateUser,deleteUser,getNGOs,getNGOById,
      approveNGO,rejectNGO,getVolunteers,getVolunteerById
    ,getDonations,getDonationById,deleteDonation,
getDeliveries,getDeliveryById,getAuditLogs,getAnalytics,
getEnvironmentalImpact,donationReport,
deliveryReport}
       from "../controllers/adminController.js";
/*Dashboard*/

router.get(

    "/dashboard",

    protect,

    authorizeRoles("admin"),

    getDashboard

);

/*
=========================================
User Management
=========================================
*/

router.get(

    "/users",

    protect,

    authorizeRoles("admin"),

    getUsers

);

router.get(

    "/users/:id",

    protect,

    authorizeRoles("admin"),

    getUserById

);

router.put(

    "/users/:id",

    protect,

    authorizeRoles("admin"),

    updateUser

);

router.delete(

    "/users/:id",

    protect,

    authorizeRoles("admin"),

    deleteUser

);
/*
=========================================
NGO Management
=========================================
*/

router.get(

    "/ngos",

    protect,

    authorizeRoles("admin"),

    getNGOs

);

router.get(

    "/ngos/:id",

    protect,

    authorizeRoles("admin"),

    getNGOById

);

router.put(

    "/ngos/:id/approve",

    protect,

    authorizeRoles("admin"),

    approveNGO

);

router.put(

    "/ngos/:id/reject",

    protect,

    authorizeRoles("admin"),

    rejectNGO

);
/*
=========================================
Volunteer Management
=========================================
*/

router.get(

    "/volunteers",

    protect,

    authorizeRoles("admin"),

    getVolunteers

);

router.get(

    "/volunteers/:id",

    protect,

    authorizeRoles("admin"),

    getVolunteerById

);
/*
=========================================
Donation Management
=========================================
*/

router.get(

    "/donations",

    protect,

    authorizeRoles("admin"),

    getDonations

);

router.get(

    "/donations/:id",

    protect,

    authorizeRoles("admin"),

    getDonationById

);

router.delete(

    "/donations/:id",

    protect,

    authorizeRoles("admin"),

    deleteDonation

);
/*
=========================================
Delivery Management
=========================================
*/

router.get(

    "/deliveries",

    protect,

    authorizeRoles("admin"),

    getDeliveries

);

router.get(

    "/deliveries/:id",

    protect,

    authorizeRoles("admin"),

    getDeliveryById

);
/*
=========================================
Audit Logs
=========================================
*/

router.get(

    "/audit-logs",

    protect,

    authorizeRoles("admin"),

    getAuditLogs

);
/*
=========================================
Analytics
=========================================
*/

router.get(

    "/analytics",

    protect,

    authorizeRoles("admin"),

    getAnalytics

);
/*
=========================================
Environmental Impact
=========================================
*/

router.get(

    "/environment",

    protect,

    authorizeRoles("admin"),

    getEnvironmentalImpact

);
/*
====================================
Reports
====================================
*/

router.get(
    "/reports/donations/:format",
    protect,
    authorizeRoles("admin"),
    donationReport
);

router.get(
    "/reports/deliveries/:format",
    protect,
    authorizeRoles("admin"),
    deliveryReport
);
export default router;