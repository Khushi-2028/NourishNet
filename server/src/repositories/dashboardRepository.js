import NGO from "../models/NGO.js";
import Delivery from "../models/Delivery.js";
import PickupRequest from "../models/PickupRequest.js";
import LocationHistory from "../models/LocationHistory.js";
import Donation from "../models/Donation.js";

class DashboardRepository {

    async getNgo(userId) {

        return NGO.findOne({

            userId

        });

    }
async activeDeliveries(ngoId) {
return Delivery.find({
    ngoId,
    status: {
        $in: [
            "assigned",
            "accepted_by_volunteer",
            "picked_up",
            "in_transit",
            "awaiting_confirmation"
        ]
    }
})
   
        .populate({
            path: "pickupRequestId",
            populate: {
                path: "donationId"
            }
        })
        .populate({
            path: "volunteerId",
            populate: {
                path: "userId"
            }
        })
        .populate("ngoId");

}
    
    async trackingHistory(deliveryId) {

        return LocationHistory.find({

            deliveryId

        })

        .sort({

            recordedAt: -1

        });

    }

    async analytics() {

        const donations =
            await Donation.countDocuments();

        const pickups =
            await PickupRequest.countDocuments();

        const deliveries =
            await Delivery.countDocuments();

        return {

            donations,

            pickups,

            deliveries

        };

    }

}

export default new DashboardRepository();