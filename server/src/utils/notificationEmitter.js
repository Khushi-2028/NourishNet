import notificationService from "../services/notificationService.js";
import { getIO } from "../sockets/socketServer.js";

export const sendNotification = async ({
    userId,
    title,
    message,
    type = "system"
}) => {

    const notification =
        await notificationService.create({

            userId,
            title,
            message,
            type

        });

    const io = getIO();

    io.to(`user_${userId}`).emit(
        "new_notification",
        notification
    );

    return notification;

};