import Donation from "../models/Donation.js";
import NGO from "../models/NGO.js";
import Volunteer from "../models/Volunteer.js";


import User from "../models/User.js";

export const getPublicStats = async (req, res) => {
  try {

    const totalDonations =
      await Donation.countDocuments();

    const totalNGOs =
      await User.countDocuments({
        role: "ngo"
      });

    const meals =
      await Donation.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$quantity"
            }
          }
        }
      ]);

    const delivered =
      await Donation.countDocuments({
        status: "delivered"
      });

    res.json({
      totalDonations,
      totalNGOs,
      mealsDelivered: meals[0]?.total || 0,
      co2Saved: delivered * 5
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }
};