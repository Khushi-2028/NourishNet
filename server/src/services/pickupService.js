import Donation from "../models/Donation.js";
import PickupRequest from "../models/PickupRequest.js";
import pickupRepository from "../repositories/pickupRepository.js";
class PickupService {

    async createRequest(data) {

        const donation = await Donation.findById(
            data.donationId
        );

        if (!donation) {
            throw new Error("Donation not found");
        }

        const requested =
            Number(data.quantityRequested);

        if (
            requested <= 0 ||
            requested > donation.remainingQuantity
        ) {
            throw new Error(
                "Requested quantity is not available."
            );
        }

        // Create pickup request

        const request =
            await PickupRequest.create({

                donationId: data.donationId,

                ngoId: data.ngoId,

                pickupDate: data.pickupDate,

                pickupTime: data.pickupTime,

                deliveryAddress: data.deliveryAddress,

                contactPerson: data.contactPerson,

                contactPhone: data.contactPhone,

                landmark: data.landmark,

                floor: data.floor,

                parkingInstructions: data.parkingInstructions,

                instructions: data.instructions,

                requestedQuantity: requested,

                allocatedQuantity: requested,

                status: "pending"

            });

        // Reduce remaining food

        donation.remainingQuantity -= requested;

        // Automatically reserve when exhausted

        if (donation.remainingQuantity === 0) {

            donation.status = "reserved";

            donation.reserved = true;

            donation.reservedAt = new Date();

        }

        await donation.save();

        return request;

    }
    async getNgoPickupRequests(ngoId) {

    return pickupRepository.findByNgo(
        ngoId
    );

}

}

export default new PickupService();