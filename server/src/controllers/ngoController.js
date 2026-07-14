import Donation from "../models/Donation.js";
import NGO from "../models/NGO.js";
import PickupRequest from "../models/PickupRequest.js";
import ngoService from "../services/ngoService.js";
import AuditLog from "../models/AuditLog.js";


// Create NGO Profile
export const createNgoProfile = async (req, res) => {

  try {

    const existingNgo = await NGO.findOne({
      userId: req.user.id
    });

    if (existingNgo) {

      return res.status(400).json({
        success: false,
        message: "Profile already exists"
      });

    }

    const ngo = await ngoService.createProfile({

      ...req.body,

      userId: req.user.id

    });

    res.status(201).json({

      success: true,

      ngo

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// Browse Available Donations
export const availableDonations = async (req, res) => {

  try {

    const donations = await Donation.find({

      status: "available",

      reserved: false

    }).populate(

      "donorId",

      "name email"

    );

    res.json({

      success: true,

      donations

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// Accept Donation
export const acceptDonation = async (req, res) => {

  try {

    const donation = await Donation.findById(
      req.params.id
    );

    if (!donation) {

      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });

    }

    if (donation.reserved) {

      return res.status(400).json({
        success: false,
        message: "Already accepted"
      });

    }

    const ngo = await NGO.findOne({

      userId: req.user.id

    });

    if (!ngo) {

      return res.status(404).json({
        success: false,
        message: "NGO profile not found"
      });

    }

    // Reserve Donation
    donation.reserved = true;

    // For reservation timeout cron job
    donation.reservedAt = new Date();

    donation.status = "accepted";

    donation.acceptedByNgo = ngo._id;

    await donation.save();

    // Audit Log
    await AuditLog.create({

      userId: req.user.id,

      action: "DONATION_ACCEPTED",

      entityType: "Donation",

      entityId: donation._id

    });

    res.json({

      success: true,

      message: "Donation accepted",

      donation

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// Reject Donation
export const rejectDonation = async (req, res) => {

  try {

    const donation = await Donation.findById(
      req.params.id
    );

    if (!donation) {

      return res.status(404).json({
        message: "Donation not found"
      });

    }

    donation.reserved = false;

    donation.status = "available";

    donation.acceptedByNgo = null;

    donation.reservedAt = null;

    await donation.save();

    // Audit Log
    await AuditLog.create({

      userId: req.user.id,

      action: "DONATION_REJECTED",

      entityType: "Donation",

      entityId: donation._id

    });

    res.json({

      success: true,

      message: "Donation released"

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// NGO Dashboard Stats
export const ngoStats = async (req, res) => {

  try {

    const ngo = await NGO.findOne({

      userId: req.user.id

    });

    const acceptedDonations =
      await Donation.countDocuments({

        acceptedByNgo: ngo._id

      });

    const pickupRequests =
      await PickupRequest.countDocuments({

        ngoId: ngo._id

      });

    res.json({

      acceptedDonations,

      pickupRequests

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};