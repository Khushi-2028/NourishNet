import LocationHistory from "../models/LocationHistory.js";

class TrackingRepository {

    /*
    =============================
    Save Location
    =============================
    */

    async create(data) {

        return await LocationHistory.create(data);

    }

    /*
    =============================
    Get Tracking History
    =============================
    */

    async findByDeliveryId(deliveryId) {

        return await LocationHistory.find({

            deliveryId

        })

        .sort({

            recordedAt: 1

        });

    }

}

export default new TrackingRepository();