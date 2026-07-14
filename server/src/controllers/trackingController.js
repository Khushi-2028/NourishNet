import Delivery from "../models/Delivery.js";
import Volunteer from "../models/Volunteer.js";
import trackingService from "../services/trackingService.js";
import routeOptimizationService from "../services/routeOptimizationService.js";
import { getIO } from "../sockets/socketServer.js";
import {emitLocationUpdated
} from "../sockets/emitters.js";
/*Update Live Location*/
export const updateLocation = async (req, res) => {
    console.log("==================================");
console.log("UPDATE LOCATION CALLED");
console.log("Delivery:", req.params.deliveryId);
console.log("Body:", req.body);
console.log("==================================");
try {
    const { latitude, longitude } = req.body;
    const delivery = await Delivery.findById(
         req.params.deliveryId);

 if (!delivery) {
 return res.status(404).json({
 success: false,
  message: "Delivery not found"
 });}

delivery.currentLocation = {
type: "Point",
coordinates: [
   longitude,latitude]};
 await delivery.save();
await trackingService.saveLocation({
 deliveryId: delivery._id,
 volunteerId: delivery.volunteerId,
coordinates: [longitude,latitude]});

let route = null;

if (
    delivery.destinationLocation &&
    delivery.destinationLocation.coordinates &&
    delivery.destinationLocation.coordinates.length === 2
) {

    const destinationLongitude =
        delivery.destinationLocation.coordinates[0];

    const destinationLatitude =
        delivery.destinationLocation.coordinates[1];

    try {

        route = await routeOptimizationService.optimizeRoute(
            {
                latitude,
                longitude
            },
            {
                latitude: destinationLatitude,
                longitude: destinationLongitude
            }
        );

    } catch (err) {

        console.log("==================================");
        console.log("Route API Failed");
        console.log(err.message);
        console.log("==================================");

        route = null;

    }
}

const io = getIO();
console.log("================================");
console.log("EMITTING LOCATION UPDATE");
console.log("NGO:", delivery.ngoId.toString());
console.log("Delivery:", delivery._id.toString());
console.log("Latitude:", latitude);
console.log("Longitude:", longitude);
console.log("================================");
console.log("Socket IDs:");
console.log([...io.sockets.sockets.keys()]);
console.log("All rooms:");
console.log([...io.sockets.adapter.rooms.entries()]);
emitLocationUpdated(io, delivery.ngoId, {
    deliveryId: delivery._id,
    ngoId: delivery.ngoId,
    latitude,
    longitude,
    currentLocation: delivery.currentLocation,
    route,
});
res.status(200).json({
success: true,
message: "Location updated successfully",
currentLocation: delivery.currentLocation,
route});}
 catch (error) {
    console.log("====================================");
    console.log("FULL ERROR");
    console.log(error);
    console.log(error.stack);
    console.log("====================================");
    res.status(500).json({
        success: false,
        message: error.message
    });
}

};
/*
==================================
Tracking History
==================================
*/

export const getTrackingHistory = async (req, res) => {

    try {

        const history = await trackingService.getHistory(
            req.params.deliveryId
        );

        res.status(200).json({

            success: true,

            history

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==================================
Current ETA
==================================
*/

export const getCurrentETA = async (req, res) => {

    try {

        const delivery =
            await Delivery.findById(
                req.params.deliveryId
            );
        if (!delivery) {

            return res.status(404).json({

                success: false,

                message: "Delivery not found"

            });

        }

        if (

            !delivery.currentLocation?.coordinates ||
            !delivery.destinationLocation?.coordinates

        ) {

            return res.status(400).json({

                success: false,

                message: "Current or destination location missing."

            });

        }

        const route =
            await routeOptimizationService.optimizeRoute(

                {

                    latitude:
                        delivery.currentLocation.coordinates[1],

                    longitude:
                        delivery.currentLocation.coordinates[0]

                },

                {

                    latitude:
                        delivery.destinationLocation.coordinates[1],

                    longitude:
                        delivery.destinationLocation.coordinates[0]

                }

            );

        res.status(200).json({

            success: true,

            distance: `${route.distanceKm} km`,

            eta: route.eta
        });}
catch (error) {
 res.status(500).json({
success: false,
message: error.message});}};
export const getDeliveryTracking = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.deliveryId)
      .populate({
        path: "pickupRequestId",
        populate: {
          path: "donationId",
          select:
            "title foodType quantity pickupAddress pickupLocation expiryTime",
        },
      })
      .populate({
        path: "ngoId",
        select: "organizationName",
      })
      .populate({
        path: "volunteerId",
        select: "name phone",
      });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.status(200).json({
      success: true,
      delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/*Active Deliveries*/
export const getActiveDeliveries = async (req, res) => {
try {
    const volunteer = await Volunteer.findOne({

    userId: req.user.id

});

if (!volunteer) {

    return res.status(404).json({

        success:false,

        message:"Volunteer profile not found"

    });

}
 const deliveries = await Delivery.find({

    volunteerId: volunteer._id,

    status: {
        $in: [
            "assigned",
            "accepted_by_volunteer",
            "picked_up",
            "in_transit","awaiting_confirmation"
        ]
    }

})
.populate({
    path: "pickupRequestId",
    populate: {
        path: "donationId"
    }
})

.populate({
    path: "ngoId"
})
.populate({
    path: "volunteerId",
    populate: {
        path: "userId"
    }
})

.sort({

    createdAt:-1

});
res.status(200).json({
success: true,
 deliveries});}

catch (error) {
res.status(500).json({
 success: false,
 message: error.message});}}
;