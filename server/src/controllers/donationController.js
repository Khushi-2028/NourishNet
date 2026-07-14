import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import donationService from "../services/donationService.js";
import { getIO } from "../sockets/socketServer.js";
import PickupRequest from "../models/PickupRequest.js";
import { sendNotification } from "../utils/notificationEmitter.js";
import User from "../models/User.js";
export const createDonation = async (req, res) => {
  try {
    const images =
req.files?.map(
    file => `/uploads/donations/${file.filename}`
) || [];
  const {
  latitude,
  longitude,
  ...rest
} = req.body;

const pickupLocation = {};

if (latitude !== undefined && latitude !== "") {
  pickupLocation.latitude = Number(latitude);
}

if (longitude !== undefined && longitude !== "") {
  pickupLocation.longitude = Number(longitude);
}

const donation = await donationService.createDonation({
  ...rest,
  donorId: req.user.id,
  images,
  pickupLocation
});
// ===============================
// DONOR NOTIFICATION
// ===============================
console.log("Creating donor notification...");

try {

    const notification = await sendNotification.create({
        userId: req.user.id,
        title: "Donation Submitted",
        message: `Your donation "${donation.title}" has been submitted successfully.`,
        type: "donation"
    });

    console.log(notification);

} catch(err){

    console.error("Notification create failed");
    console.error(err);

}
// ===============================
// ADMIN NOTIFICATION
// ===============================

const admins = await User.find({ role: "admin" }).select("_id");

await Promise.all(
  admins.map((admin) =>
    notificationService.create({
      userId: admin._id,
      title: "New Donation",
      message: `${req.user.name || "A donor"} submitted a new donation "${donation.title}".`,
      type: "admin"
    })
  )
);
    //socket notification
    getIO().emit(
    "new_donation",
    donation
    );
    res.status(201).json({
      success: true,
       message: "Donation created successfully",
      donation
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getDonations = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {

      filter.title = {
        $regex: req.query.search,
        $options: "i"
      };

    }

    if (req.query.foodType) {
      filter.foodType = req.query.foodType;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.city) {
      filter.pickupAddress = {
        $regex: req.query.city,
        $options: "i"
      };
    }

    let sortOption = {
      createdAt: -1
    };

    if (req.query.sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (req.query.sort === "quantity") {
      sortOption = { quantity: -1 };
    }

    const donations = await Donation.find(filter)
      .populate(
        "donorId",
        "name email"
      )
      .skip(skip)
      .limit(limit)
      .sort(sortOption);
      const donationsWithPickup = await Promise.all(
  donations.map(async (donation) => {
    const pickup = await PickupRequest.findOne({
      donationId: donation._id,
    });

    return {
      ...donation.toObject(),
      pickupRequest: pickup,
    };
  })
);

    const total =
      await Donation.countDocuments(filter);

   res.json({
  page,
  total,
  pages: Math.ceil(total / limit),
  donations: donationsWithPickup
});
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getDonationById = async (req, res) => {

  try {

    const donation = await Donation.findById(
      req.params.id
    ).populate(
      "donorId",
      "name email"
    );

    if (!donation) {

      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });

    }

    res.json({
      success: true,
      donation
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const updateDonation = async (req, res) => {

  try {

    const donation =
      await Donation.findById(
        req.params.id
      );

    if (!donation) {

      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });

    }

    if (
      donation.donorId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied"
      });

    }

    const {
    title,
    description,
    foodType,
    quantity,
    unit,
    preparationTime,
    expiryTime,
    pickupAddress,
    latitude,
    longitude
} = req.body;

donation.title = title ?? donation.title;
donation.description = description ?? donation.description;
donation.foodType = foodType ?? donation.foodType;
donation.quantity = quantity ?? donation.quantity;
donation.unit = unit ?? donation.unit;
donation.preparationTime = preparationTime ?? donation.preparationTime;
donation.expiryTime = expiryTime ?? donation.expiryTime;
donation.pickupAddress = pickupAddress ?? donation.pickupAddress;

if (latitude || longitude) {
    donation.pickupLocation = {
        latitude: latitude
            ? Number(latitude)
            : donation.pickupLocation?.latitude,
        longitude: longitude
            ? Number(longitude)
            : donation.pickupLocation?.longitude
    };
}

    await donation.save();

    res.json({
      success: true,
      donation
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const deleteDonation = async (
  req,
  res
) => {

  try {

    const donation =
      await Donation.findById(
        req.params.id
      );

    if (!donation) {

      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });

    }

    if (
      donation.donorId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied"
      });

    }

    await donation.deleteOne();

    res.json({
      success: true,
      message: "Donation deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const donorStats = async (req, res) => {
  try {

    const totalDonations =
      await donationService.countDonations(req.user.id);

    const delivered =
      await donationService.countDelivered(req.user.id);

    const quantity =
      await donationService.getFoodSaved(req.user.id);

    res.json({
      totalDonations,
      delivered,
      foodSaved: quantity[0]?.total || 0
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


  export const updateDonationStatus = async (
  req,
  res
) => {

  try {

    const donation =
      await Donation.findById(
        req.params.id
      );

    if (!donation) {

      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });

    }

    const allowedStatuses = [
    "available",
    "reserved",
    "accepted",
    "volunteer_assigned",
    "pickup_started",
    "picked",
    "in_transit","awaiting_confirmation",
    "delivered",
    "cancelled",
    "expired"
];

    if (
      !allowedStatuses.includes(
        req.body.status
      )
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });

    }

    donation.status =
      req.body.status;

    await donation.save();

    res.json({
      success: true,
      donation
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};