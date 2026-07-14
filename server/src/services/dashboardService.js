import dashboardRepository
from "../repositories/dashboardRepository.js";

import Delivery
from "../models/Delivery.js";

import PickupRequest
from "../models/PickupRequest.js";

class DashboardService {

    async ngoDashboard(userId) {

        const ngo =
            await dashboardRepository.getNgo(userId);

        if (!ngo) {

            throw new Error("NGO not found");

        }
const activeDeliveries =
await Delivery.countDocuments({

    ngoId: ngo._id,

    status: {
        $in: [
            "assigned",
            "accepted_by_volunteer",
            "picked_up",
            "in_transit",
            "awaiting_confirmation"
        ]
    }

});
       
        const completedDeliveries =
            await Delivery.countDocuments({

                ngoId: ngo._id,

                status: "delivered"

            });

        const pendingPickups =
            await PickupRequest.countDocuments({

                ngoId: ngo._id,

                status: "pending"

            });

        return {

            activeDeliveries,

            completedDeliveries,

            pendingPickups

        };

    }

    async activeDeliveries(userId) {

        const ngo =
            await dashboardRepository.getNgo(userId);

        if (!ngo) {

            throw new Error("NGO not found");

        }

        return dashboardRepository.activeDeliveries(
            ngo._id
        );

    }

    async trackingHistory(deliveryId) {

        return dashboardRepository.trackingHistory(
            deliveryId
        );

    }

    async analytics() {

        return dashboardRepository.analytics();

    }

}

export default new DashboardService();