import Donation from "../models/Donation.js";
import NGO from "../models/NGO.js";
import PickupRequest from "../models/PickupRequest.js";
import pickupService from "../services/pickupService.js";
import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import { sendNotification } from "../utils/notificationEmitter.js";
export const createPickupRequest = async (req, res) => {
    try {

        const donation = await Donation.findById(
            req.params.donationId
        );

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found"
            });
        }

        if (donation.remainingQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Donation no longer available"
            });
        }

        const ngo = await NGO.findOne({
            userId: req.user.id
        });

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO not found"
            });
        }

        // Prevent duplicate request by same NGO

        const alreadyRequested =
            await PickupRequest.findOne({

                donationId: donation._id,

                ngoId: ngo._id

            });

        if (alreadyRequested) {

            return res.status(400).json({

                success:false,

                message:"Pickup request already exists."

            });

        }

        const request =
            await pickupService.createRequest({

                donationId: donation._id,

                ngoId: ngo._id,

                pickupDate: req.body.pickupDate,

                pickupTime: req.body.pickupTime,

                deliveryAddress: req.body.deliveryAddress,

                contactPerson: req.body.contactPerson,

                contactPhone: req.body.contactPhone,

                landmark: req.body.landmark,

                floor: req.body.floor,

                parkingInstructions: req.body.parkingInstructions,

                instructions: req.body.instructions,

                quantityRequested:
                    req.body.quantityRequested || donation.remainingQuantity

            });
            const donor = await User.findById(donation.donorId);

await sendNotification({
    userId: donor._id,
    title: "Pickup Requested",
    message: `${ngo.organizationName} has requested pickup for "${donation.title}".`,
    type: "pickup"
});
const admins = await User.find({ role: "admin" });

await Promise.all(
    admins.map((admin) =>
        sendNotification({
            userId: admin._id,
            title: "Pickup Request",
            message: `${ngo.organizationName} created a pickup request.`,
            type: "admin"
        })
    )
);

        res.status(201).json({

            success:true,

            request

        });

        await AuditLog.create({

            userId:req.user.id,

            action:"PICKUP_CREATED",

            entityType:"PickupRequest",

            entityId:request._id

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};
/*
==========================================
GET ALL PICKUP REQUESTS OF LOGGED-IN NGO
==========================================
*/

export const getNgoPickupRequests = async (req, res) => {

    try {

        const ngo = await NGO.findOne({

            userId: req.user.id

        });

        if (!ngo) {

            return res.status(404).json({

                success: false,

                message: "NGO not found"

            });

        }

        const pickupRequests =
            await pickupService.getNgoPickupRequests(
                ngo._id
            );

        return res.status(200).json({

            success: true,

            pickupRequests

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};