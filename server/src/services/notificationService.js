import notificationRepository
from "../repositories/notificationRepository.js";

class NotificationService {

    async create(data) {

        return await notificationRepository.create(
            data
        );

    }

    async getUserNotifications(userId) {

        return await notificationRepository.findByUser(
            userId
        );

    }

    async unreadCount(userId) {

        return await notificationRepository.unreadCount(
            userId
        );

    }

    async markRead(id, userId) {

        return await notificationRepository.markRead(

            id,

            userId

        );

    }

    async markAllRead(userId) {

        return await notificationRepository.markAllRead(

            userId

        );

    }

    async deleteNotification(id, userId) {

        return await notificationRepository.deleteNotification(

            id,

            userId

        );

    }

}

export default new NotificationService();