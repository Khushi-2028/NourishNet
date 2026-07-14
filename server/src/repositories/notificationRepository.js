import Notification from "../models/Notification.js";

class NotificationRepository {

    async create(data) {

        return await Notification.create(data);

    }

    async findByUser(userId) {

        return await Notification.find({

            userId

        }).sort({

            createdAt: -1

        });

    }

    async unreadCount(userId) {

        return await Notification.countDocuments({

            userId,

            read: false

        });

    }

    async markRead(id, userId) {

        return await Notification.findOneAndUpdate(

            {

                _id: id,

                userId

            },

            {

                read: true

            },

            {

                new: true

            }

        );

    }

    async markAllRead(userId) {

        return await Notification.updateMany(

            {

                userId,

                read: false

            },

            {

                read: true

            }

        );

    }

    async deleteNotification(id, userId) {

        return await Notification.findOneAndDelete({

            _id: id,

            userId

        });

    }

}

export default new NotificationRepository();