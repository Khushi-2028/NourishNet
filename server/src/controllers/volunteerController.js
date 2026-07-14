import Volunteer from "../models/Volunteer.js";
import volunteerService from "../services/volunteerService.js";


// Create Volunteer Profile
export const createProfile = async (req, res) => {

  try {

    const existingVolunteer =
      await Volunteer.findOne({
        userId: req.user.id
      });

    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists"
      });
    }

    const volunteer =
      await volunteerService.createProfile({

        ...req.body,

        userId: req.user.id

      });

    res.status(201).json({
      success: true,
      volunteer
    });

  }

  catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// Volunteer Dashboard
export const dashboard = async (req, res) => {

  try {

    const volunteer =
      await Volunteer.findOne({
        userId: req.user.id
      });

    if (!volunteer) {

      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found"
      });

    }

    res.json({

      completedDeliveries:
        volunteer.completedDeliveries,

      distanceCovered:
        volunteer.distanceCovered,

      rating:
        volunteer.rating

    });

  }

  catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


export const getAvailableVolunteers = async (req,res)=>{

    try{
        const volunteers = await Volunteer.find({
    isAvailable: true
}).populate(
    "userId",
    "name email"
);  
        res.json({
            success:true,
            volunteers
        });

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};