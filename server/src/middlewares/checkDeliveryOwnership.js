import Delivery from "../models/Delivery.js";
import Volunteer from "../models/Volunteer.js";

const checkDeliveryOwnership = async (req, res, next) => {

    try {

        const volunteer = await Volunteer.findOne({

            userId: req.user.id

        });

        if (!volunteer) {

            return res.status(404).json({

                success: false,

                message: "Volunteer profile not found"

            });

        }

        /*
        ======================================
        Support both :id and :deliveryId
        ======================================
        */

        const deliveryId =

            req.params.id ||

            req.params.deliveryId;

        const delivery = await Delivery.findById(

            deliveryId

        );

        if (!delivery) {

            return res.status(404).json({

                success: false,

                message: "Delivery not found"

            });

        }

        if (

            delivery.volunteerId.toString() !==

            volunteer._id.toString()

        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized"

            });

        }

        req.delivery = delivery;

        next();

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export default checkDeliveryOwnership;