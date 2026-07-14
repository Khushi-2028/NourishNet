import Delivery from "../models/Delivery.js";
import PickupRequest from "../models/PickupRequest.js";
import Volunteer from "../models/Volunteer.js";
import Donation from "../models/Donation.js";
import NGO from "../models/NGO.js";
import deliveryService from "../services/deliveryService.js";
import createAuditLog from "../utils/createAuditLog.js";
import { getIO } from "../sockets/socketServer.js";
import {emitDashboardRefresh, emitDeliveryCompleted} from "../sockets/emitters.js";
import sendPushNotification from "../utils/sendPushNotification.js";
import { sendNotification } from "../utils/notificationEmitter.js";
import User from "../models/User.js";
// Assign Volunteer
export const assignVolunteer = async (req, res) => {
try {
console.log("Assign Volunteer Request");
console.log(req.body);
console.log(req.body.volunteerId);
const volunteer = await Volunteer.findById(req.body.volunteerId);
if (!volunteer) {
    return res.status(404).json({
        success: false,
        message: "Volunteer not found"});}
if (!volunteer.isAvailable) {
    return res.status(400).json({
        success: false,
        message: "Volunteer is not available."});}
const pickup =await PickupRequest.findById(req.params.pickupId);
if (!pickup) {
        return res.status(404).json({
            success: false,
            message: "Pickup request not found" });}
const ngo = await NGO.findOne({ userId: req.user.id });
        if (!ngo) { return res.status(404).json({
     success: false,message: "NGO not found" }); }
const donation =await Donation.findById(pickup.donationId);
 if (!donation) { return res.status(404).json({
success: false, message: "Donation not found" });}

//Validate Donation Pickup Location
if (
    !donation.pickupLocation ||
    donation.pickupLocation.latitude == null ||
    donation.pickupLocation.longitude == null
) {
    return res.status(400).json({
        success: false,
        message: "Donation pickup location is missing."});}

//Validate NGO Location
if(!ngo.location ||
 ngo.location.latitude === undefined ||
ngo.location.longitude === undefined) {
return res.status(400).json({
success: false,message:
"NGO location is missing." });}

// Create Delivery
volunteer.isAvailable = false;
await volunteer.save();
const delivery =await deliveryService.create({
pickupRequestId: pickup._id,donationId: pickup.donationId,
volunteerId: volunteer._id,ngoId: ngo._id,
pickupLocation: {type: "Point",coordinates: [
donation.pickupLocation.longitude,donation.pickupLocation.latitude]},
currentLocation: {type: "Point",coordinates:[
 donation.pickupLocation.longitude,donation.pickupLocation.latitude ]},
destinationLocation: {type: "Point", coordinates: [
ngo.location.longitude, ngo.location.latitude] } });

// Update pickup request
pickup.volunteerId = volunteer._id;
pickup.status = "assigned";
await pickup.save();
donation.status = "volunteer_assigned";
await donation.save();
const donor = await User.findById(donation.donorId);

await sendNotification({
    userId: donor._id,
    title: "Volunteer Assigned",
    message: `A volunteer has been assigned to deliver "${donation.title}".`,
    type: "delivery"
});
//Audit Log
await createAuditLog({ userId: req.user.id,
action: "VOLUNTEER_ASSIGNED", entityType: "Delivery",
 entityId: delivery._id });

 //Create Notification for Volunteer
await sendNotification({userId: volunteer.userId,
title: "New Pickup Task",
message: "You have been assigned a delivery.",
type: "delivery"});
const admins = await User.find({ role: "admin" });

await Promise.all(
    admins.map((admin) =>
        sendNotification({
            userId: admin._id,
            title: "Volunteer Assigned",
            message: `${volunteer.name} assigned for delivery.`,
            type: "admin"
        })
    )
);

/*Push Notification*/
if (volunteer.deviceToken) {
 await sendPushNotification(
 volunteer.deviceToken,
 "New Pickup Task",
"You have been assigned a delivery" );}

//Socket Event
const io = getIO();
io.to(
 `volunteer_${volunteer._id}`).emit(
"task_assigned",
 { deliveryId: delivery._id });
emitDashboardRefresh(io,ngo._id);

// Response
res.status(201).json({
 success: true,
 message: "Volunteer assigned successfully.",
delivery });}
catch (error) {
 res.status(500).json({
 success: false,message: error.message}); }};
   
//accept task
export const acceptTask = async(req,res)=>{
try{
const delivery =
await Delivery.findById(req.params.id);
delivery.status =
"accepted_by_volunteer";
await delivery.save();
await createAuditLog({
userId:req.user.id,
action:"VOLUNTEER_ACCEPTED_TASK",
entityType:"Delivery",
entityId:delivery._id});
/*Notify NGO */
const ngo = await NGO.findById(
    delivery.ngoId
);
await sendNotification({
userId: ngo.userId,title: "Task Accepted",
message: "Volunteer accepted the assigned delivery.",
type: "delivery"});
const io = getIO();
io.to(`ngo_${delivery.ngoId}`).emit("notification");
emitDashboardRefresh(
    io,
    ngo._id
);
const donation = await Donation.findById(delivery.donationId);

await sendNotification({
    userId: donation.donorId,
    title: "Volunteer Accepted",
    message: "A volunteer accepted your donation pickup.",
    type: "delivery"
});
res.json({
success:true
});

}

catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};
//pickUp food
export const pickupFood = async(req,res)=>{

try{

const delivery =
await Delivery.findById(req.params.id);

delivery.status ="picked_up";
await delivery.save();

const donation = await Donation.findById(
    delivery.donationId
);

donation.status = "picked";
await donation.save();

delivery.pickupTime =
new Date();

await delivery.save();
await createAuditLog({

userId:req.user.id,

action:"FOOD_PICKED_UP",

entityType:"Delivery",

entityId:delivery._id

});
/*notify NGO*/
const ngo = await NGO.findById(
    delivery.ngoId
);

await sendNotification({

    userId: ngo.userId,

    title: "Food Picked Up",

    message: "Volunteer has picked up the donation.",

    type: "pickup"

});
const io = getIO();
io.to(`ngo_${delivery.ngoId}`).emit("notification");
emitDashboardRefresh(
    io,
    ngo._id
);
await sendNotification({
    userId: donation.donorId,
    title: "Food Picked Up",
    message: "Your donation has been picked up by the volunteer.",
    type: "pickup"
});
res.json({
success:true
});

}

catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};
//start transit
export const startTransit = async (req, res) => {
    try {

        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found"
            });
        }

        if (delivery.status !== "picked_up") {
            return res.status(400).json({
                success: false,
                message: "Food must be picked up before starting transit."
            });
        }

        delivery.status = "in_transit";
        await delivery.save();

        const donation = await Donation.findById(delivery.donationId);

        donation.status = "in_transit";
        await donation.save();

        await createAuditLog({
            userId: req.user.id,
            action: "IN_TRANSIT",
            entityType: "Delivery",
            entityId: delivery._id
        });


/*notify NGO */
const ngo = await NGO.findById(
    delivery.ngoId
);

const io = getIO();
await sendNotification({

    userId: ngo.userId,

    title: "Delivery In Transit",

    message: "Volunteer is on the way to deliver the donation.",

    type: "delivery"

});
io.to(`ngo_${delivery.ngoId}`).emit("notification");
emitDashboardRefresh(
    io,
    ngo._id
);
await sendNotification({
    userId: donation.donorId,
    title: "Delivery In Transit",
    message: "Your donation is on the way to the NGO.",
    type: "delivery"
});
res.json({
success:true
});

}

catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};
//complete delivery 
export const completeDelivery = async(req,res)=>{
try{
const delivery =await Delivery.findById(req.params.id);

if (!delivery) {
    return res.status(404).json({
        success: false,
        message: "Delivery not found"
    });
}
if (delivery.status !== "in_transit") {
    return res.status(400).json({
        success: false,
        message: "Delivery must be in transit first."
    });
}

delivery.status ="awaiting_confirmation";
await delivery.save();

const donation = await Donation.findById(
    delivery.donationId
);
donation.status = "awaiting_confirmation";
await donation.save();
delivery.deliveryTime =new Date();
await delivery.save();

const volunteer =await Volunteer.findById(
delivery.volunteerId);
volunteer.completedDeliveries++;
volunteer.isAvailable = true;
await volunteer.save();
await createAuditLog({
userId:req.user.id,action:"DELIVERY_COMPLETED",
entityType:"Delivery",entityId:delivery._id});
/*notify NGO*/
const ngo = await NGO.findById(delivery.ngoId);
await sendNotification({
userId: ngo.userId,title: "Delivery Completed",
message: "Food has been delivered successfully.", 
type: "delivery"});
const io = getIO();
io.to(`ngo_${delivery.ngoId}`).emit("notification");
emitDashboardRefresh(
    io,ngo._id);
emitDeliveryCompleted(
    io,ngo._id, delivery);
await sendNotification({
    userId: donation.donorId,
    title: "Delivery Completed",
    message: "Your donation has reached the NGO and is awaiting confirmation.",
    type: "delivery"
});
const admins = await User.find({ role: "admin" });

await Promise.all(
    admins.map((admin) =>
        sendNotification({
            userId: admin._id,
            title: "Delivery Completed",
            message: "A volunteer completed a delivery.",
            type: "admin"
        })
    )
);
res.json({
success:true,
message:"Delivery completed"
});
}
catch(error){
res.status(500).json({
success:false,
message:error.message
});
}
};
export const uploadDeliveryProof = async (req, res) => {
    console.log("BODY:", req.body);
console.log("FILE:", req.file);

    try {

        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {

            return res.status(404).json({

                success: false,
                message: "Delivery not found"

            });

        }

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "Proof image missing"

            });

        }

        delivery.proofImage =
            `/uploads/proofs/${req.file.filename}`;

        delivery.proofNotes =
            req.body.notes || "";

        delivery.proofUploadedAt =
            new Date();

        await delivery.save();
        const ngo = await NGO.findById(delivery.ngoId);

await sendNotification({
    userId: ngo.userId,
    title: "Proof Uploaded",
    message: "Volunteer uploaded delivery proof.",
    type: "delivery"
});

  const io = getIO();
io.to(`ngo_${delivery.ngoId}`).emit("notification");
        io.to(`ngo_${delivery.ngoId}`)
            .emit("proof_uploaded", {

                deliveryId: delivery._id,

                image: delivery.proofImage,

                notes: delivery.proofNotes,

                uploadedAt: delivery.proofUploadedAt

            });

      return res.json({
    success: true,
    message: "Proof uploaded successfully",
    delivery
});  

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};//confirm delivery
export const confirmDelivery = async (req, res) => {
    try {

        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found"
            });
        }

        if (!delivery.proofImage) {
            return res.status(400).json({
                success: false,
                message: "Proof has not been uploaded yet."
            });
        }

        if (delivery.confirmedAt) {
            return res.status(400).json({
                success: false,
                message: "Delivery already confirmed."
            });
        }
delivery.status = "delivered";
        delivery.confirmedAt = new Date();
        delivery.confirmedBy = req.user.id;

        await delivery.save();

        const donation = await Donation.findById(delivery.donationId);

        if (donation) {
            donation.status = "delivered";
            await sendNotification({
    userId: donation.donorId,
    title: "Donation Delivered",
    message: "The NGO has confirmed receiving your donation.",
    type: "delivery"
});
            await donation.save();
        }await delivery.save();

        const volunteer = await Volunteer.findById(delivery.volunteerId);

        const io = getIO();
await sendNotification({
            userId: volunteer.userId,
            title: "Delivery Confirmed",
            message: "The NGO has confirmed your delivery.",
            type: "delivery"
        });
        const admins = await User.find({ role: "admin" });

await Promise.all(
    admins.map((admin) =>
        sendNotification({
            userId: admin._id,
            title: "Delivery Confirmed",
            message: "An NGO confirmed a completed delivery.",
            type: "admin"
        })
    )
);
io.to(`volunteer_${delivery.volunteerId}`).emit("notification");
        await createAuditLog({
            userId: req.user.id,
            action: "DELIVERY_CONFIRMED",
            entityType: "Delivery",
            entityId: delivery._id
        });
        io.to(`volunteer_${delivery.volunteerId}`).emit(
            "delivery_confirmed",
            {
                deliveryId: delivery._id,
                confirmedAt: delivery.confirmedAt
            }
        );

        emitDashboardRefresh(io, delivery.ngoId);

        res.json({
            success: true,
            message: "Delivery confirmed successfully.",
            delivery
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const getDeliveryById = async (req, res) => {
    try {

        const delivery = await Delivery.findById(req.params.id)
            .populate({
                path: "volunteerId",
                populate: {
                    path: "userId",
                    select: "name email phone"
                }
            })
            .populate("donationId")
            .populate("ngoId");

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found"
            });
        }

        res.json({
            success: true,
            delivery
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};