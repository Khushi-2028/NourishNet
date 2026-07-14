import Delivery
from "../models/Delivery.js";

class DeliveryRepository {

  create(data) {

    return Delivery.create(
      data
    );

  }

  findById(id) {

    return Delivery.findById(id);

  }

  update(id,data) {

    return Delivery.findByIdAndUpdate(
      id,
      data,
      { new:true }
    );

  }

  findByVolunteer(volunteerId) {

    return Delivery.find({
      volunteerId
    });

  }

}

export default new DeliveryRepository();