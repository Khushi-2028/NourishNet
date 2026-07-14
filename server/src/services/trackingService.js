import trackingRepository from "../repositories/trackingRepository.js";

class TrackingService {

    /*
    ==================================
    Save Live Location
    ==================================
    */

    async saveLocation(data) {

        return await trackingRepository.create(data);

    }

    /*
    ==================================
    Tracking History
    ==================================
    */

    async getHistory(deliveryId) {

        return await trackingRepository.findByDeliveryId(
            deliveryId
        );

    }

}

export default new TrackingService();