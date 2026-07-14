import Donation from "../models/Donation.js";
import mongoose from "mongoose";

class DonationRepository {

  create(data) {

    return Donation.create(data);

  }

 findById(id) {
    return Donation.findById(id)
        .populate("donorId", "name email");
}

  update(id, data) {

    return Donation.findByIdAndUpdate(

      id,

      data,

      {
        new: true
      }

    );

  }

  delete(id) {

    return Donation.findByIdAndDelete(
      id
    );

  }

  findAll(
    filter,
    skip,
    limit
  ) {

    return Donation.find(filter)

      .skip(skip)

      .limit(limit)

      .sort({
        createdAt: -1
      });

  }

  count(filter) {

    return Donation.countDocuments(
      filter
    );

  }

  countByDonor(
    donorId
  ) {

    return Donation.countDocuments({

      donorId

    });

  }

  countDelivered(
    donorId
  ) {

    return Donation.countDocuments({

      donorId,

      status: "delivered"

    });

  }
  getFoodSaved(donorId) {
    return Donation.aggregate([
        {
            $match: {
                donorId: new mongoose.Types.ObjectId(donorId)
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$quantity"
                }
            }
        }
    ]);
}
}

export default new DonationRepository();