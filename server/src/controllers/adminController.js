import adminService from "../services/adminService.js";

/*
=========================================
Admin Dashboard
=========================================
*/

export const getDashboard = async (req, res) => {
    try {

        const dashboard = await adminService.getDashboard();

        res.status(200).json({
            success: true,
            dashboard
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
=========================================
Get All Users
=========================================
*/

export const getUsers = async (req, res) => {

    try {

        const {
            search = "",
            role = "",
            page = 1,
            limit = 10
        } = req.query;

        const result = await adminService.getUsers(
            search,
            role,
            Number(page),
            Number(limit)
        );

        res.status(200).json({
            success: true,
            total: result.total,
            users: result.users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
=========================================
Get User By ID
=========================================
*/

export const getUserById = async (req, res) => {

    try {

        const user = await adminService.getUserById(
            req.params.id
        );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
=========================================
Update User
=========================================
*/

export const updateUser = async (req, res) => {

    try {

        const user = await adminService.updateUser(
            req.params.id,
            req.body
        );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
=========================================
Delete User
=========================================
*/

export const deleteUser = async (req, res) => {

    try {

        const user = await adminService.deleteUser(
            req.params.id
        );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
=========================================
Get All NGOs
=========================================
*/

export const getNGOs = async (req, res) => {

    try {

        const ngos = await adminService.getNGOs();

        res.status(200).json({
            success: true,
            ngos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
=========================================
Get NGO By ID
=========================================
*/

export const getNGOById = async (req, res) => {

    try {

        const ngo = await adminService.getNGOById(
            req.params.id
        );

        if (!ngo) {

            return res.status(404).json({
                success: false,
                message: "NGO not found"
            });

        }

        res.status(200).json({
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

/*
=========================================
Approve NGO
=========================================
*/

export const approveNGO = async (req, res) => {

    try {

        const ngo = await adminService.approveNGO(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "NGO approved successfully",
            ngo
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
=========================================
Reject NGO
=========================================
*/

export const rejectNGO = async (req, res) => {

    try {

        const ngo = await adminService.rejectNGO(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "NGO rejected successfully",
            ngo
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
/*
=========================================
Get All Volunteers
=========================================
*/

export const getVolunteers = async (req, res) => {

    try {

        const volunteers = await adminService.getVolunteers();

        res.status(200).json({

            success: true,

            volunteers

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
=========================================
Get Volunteer By Id
=========================================
*/

export const getVolunteerById = async (req, res) => {

    try {

        const volunteer = await adminService.getVolunteerById(

            req.params.id

        );

        if (!volunteer) {

            return res.status(404).json({

                success: false,

                message: "Volunteer not found"

            });

        }

        res.status(200).json({

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
/*
=========================================
Get All Donations
=========================================
*/

export const getDonations = async (req, res) => {

    try {

        const donations = await adminService.getDonations();

        res.status(200).json({

            success: true,

            donations

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================
Get Donation By Id
=========================================
*/

export const getDonationById = async (req, res) => {

    try {

        const donation = await adminService.getDonationById(

            req.params.id

        );

        if (!donation) {

            return res.status(404).json({

                success: false,

                message: "Donation not found"

            });

        }

        res.status(200).json({

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

/*
=========================================
Delete Donation
=========================================
*/

export const deleteDonation = async (req, res) => {

    try {

        const donation = await adminService.deleteDonation(

            req.params.id

        );

        if (!donation) {

            return res.status(404).json({

                success: false,

                message: "Donation not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Donation deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/*
=========================================
Get All Deliveries
=========================================
*/

export const getDeliveries = async (req, res) => {

    try {

        const deliveries = await adminService.getDeliveries();

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

/*
=========================================
Get Delivery By Id
=========================================
*/

export const getDeliveryById = async (req, res) => {

    try {

        const delivery = await adminService.getDeliveryById(

            req.params.id

        );

        if (!delivery) {

            return res.status(404).json({

                success: false,

                message: "Delivery not found"

            });

        }

        res.status(200).json({

            success: true,

            delivery

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
=========================================
Get Audit Logs
=========================================
*/

export const getAuditLogs = async (req, res) => {

    try {

        const {

            userId,

            action,

            entityType,

            startDate,

            endDate

        } = req.query;

        const logs = await adminService.getAuditLogs({

            userId,

            action,

            entityType,

            startDate,

            endDate

        });

        res.status(200).json({

            success: true,

            count: logs.length,

            logs

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
=========================================
Analytics
=========================================
*/

export const getAnalytics = async (req, res) => {

    try {

        const analytics =

            await adminService.getAnalytics();

        res.status(200).json({

            success: true,

            analytics

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
=========================================
Environmental Impact
=========================================
*/

export const getEnvironmentalImpact = async (req, res) => {

    try {

        const impact =
            await adminService.getEnvironmentalImpact();

        res.status(200).json({

            success: true,

            impact

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
====================================
Donation Report
====================================
*/

export const donationReport = async (req, res) => {

    const { format } = req.params;

    const report = await adminService.generateDonationReport(format);

    if (format === "pdf") {

        res.setHeader("Content-Type", "application/pdf");

    }

    else if (format === "excel") {

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

    }

    else {

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

    }

    res.send(report);

};


//Delivery Report

export const deliveryReport = async (req, res) => {
const { format } = req.params;
const report = await adminService.generateDeliveryReport(format);
if (format === "pdf") {
res.setHeader("Content-Type", "application/pdf");}
else if (format === "excel") {
res.setHeader(
"Content-Type",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");}
else {
res.setHeader("Content-Type","text/csv");}
res.send(report);};