import notificationService
from "../services/notificationService.js";

/*
=========================================
Get All Notifications
=========================================
*/

export const getNotifications =
async (req, res) => {

    try {

        const notifications =

            await notificationService.getUserNotifications(

                req.user.id

            );

        res.json({

            success: true,

            notifications

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================
Unread Count
=========================================
*/

export const getUnreadCount =
async (req, res) => {

    try {

        const unreadCount =

            await notificationService.unreadCount(

                req.user.id

            );

        res.json({

            success: true,

            unreadCount

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================
Mark One Notification Read
=========================================
*/

export const markRead =
async (req, res) => {

    try {

        const notification =

            await notificationService.markRead(

                req.params.id,

                req.user.id

            );

        res.json({

            success: true,

            notification

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================
Mark All Notifications Read
=========================================
*/

export const markAllRead =
async (req, res) => {

    try {

        await notificationService.markAllRead(

            req.user.id

        );

        res.json({

            success: true,

            message: "All notifications marked as read."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================
Delete Notification
=========================================
*/

export const deleteNotification =
async (req, res) => {

    try {

        await notificationService.deleteNotification(

            req.params.id,

            req.user.id

        );

        res.json({

            success: true,

            message: "Notification deleted."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};