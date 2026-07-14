import PickupRequest from "../models/PickupRequest.js";

class PickupRepository {

  /*
  ==========================================
  CREATE PICKUP REQUEST
  ==========================================
  */

  create(data) {
    return PickupRequest.create(data);
  }

  /*
  ==========================================
  GET ALL PICKUP REQUESTS OF AN NGO
  ==========================================
  */

  findByNgo(ngoId) {

    return PickupRequest.find({

      ngoId

    })

      .populate({

        path: "donationId",

        select:
          "title foodType quantity unit pickupAddress expiryTime images donorId status"

      })

      .populate({

        path: "ngoId",

        select: "organizationName"

      })

      .populate({

        path: "volunteerId",

        select: "name phone"

      })

      .sort({

        createdAt: -1

      });

  }

}

export default new PickupRepository();