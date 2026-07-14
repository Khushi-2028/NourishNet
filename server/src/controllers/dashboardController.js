import dashboardService
from "../services/dashboardService.js";


//NGO Dashboard
export const ngoDashboard = async (req, res) => {
    try {

        const data =
            await dashboardService.ngoDashboard(
                req.user.id
            );

        res.status(200).json({

            success: true,

            dashboard: data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
//Active Deliveries
export const activeDeliveries = async (req, res) => {

    try {

        const deliveries =
            await dashboardService.activeDeliveries(
                req.user.id
            );

        res.status(200).json({

            success: true,

            deliveries

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


//Tracking History

export const trackingHistory = async (req, res) => {

    try {

        const history =
            await dashboardService.trackingHistory(

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


//Platform Analytics

export const analytics = async (req, res) => {

    try {

        const data =
            await dashboardService.analytics();

        res.status(200).json({

            success: true,

            analytics: data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};