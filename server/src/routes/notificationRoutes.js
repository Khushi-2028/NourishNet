import express from "express";

const router = express.Router();

import protect from "../middlewares/authMiddleware.js";

import {

    getNotifications,

    getUnreadCount,

    markRead,

    markAllRead,

    deleteNotification

}
from "../controllers/notificationController.js";

/*
=========================================
Get All Notifications
=========================================
*/

router.get(

    "/",

    protect,

    getNotifications

);

/*
=========================================
Get Unread Notification Count
=========================================
*/

router.get(

    "/unread-count",

    protect,

    getUnreadCount

);

/*
=========================================
Mark One Notification As Read
=========================================
*/

router.put(

    "/read/:id",

    protect,

    markRead

);

/*
=========================================
Mark All Notifications As Read
=========================================
*/

router.put(

    "/read-all",

    protect,

    markAllRead

);

/*
=========================================
Delete Notification
=========================================
*/

router.delete(

    "/:id",

    protect,

    deleteNotification

);

export default router;