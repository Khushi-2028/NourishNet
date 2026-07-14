import deliveryRepository
from "../repositories/deliveryRepository.js";

class DeliveryService {

    /*
    ==================================
    Create Delivery
    ==================================
    */

    async create(data) {

        return await deliveryRepository.create(data);

    }

    /*
    ==================================
    Update Delivery
    ==================================
    */

    async update(id, data) {

        return await deliveryRepository.update(
            id,
            data
        );

    }

    /*
    ==================================
    Get Delivery
    ==================================
    */

    async get(id) {

        return await deliveryRepository.findById(
            id
        );

    }

}
export const uploadDeliveryProof = async (
    deliveryId,
    formData,
    token
) => {

    const response = await fetch(
        `${API_URL}/deliveries/${deliveryId}/proof`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    return response.json();
}

export default new DeliveryService();