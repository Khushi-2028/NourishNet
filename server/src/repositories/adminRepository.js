import User from "../models/User.js";
import Donation from "../models/Donation.js";
import NGO from "../models/NGO.js";
import Volunteer from "../models/Volunteer.js";
import Delivery from "../models/Delivery.js";
import AuditLog from "../models/AuditLog.js";
import mongoose from "mongoose";
class AdminRepository {

    async getDashboardStats() {
    const [totalUsers,totalDonors,
     totalNGOs,totalVolunteers,totalDonations,
     totalDeliveries, activeDeliveries] = await Promise.all([
     User.countDocuments(), User.countDocuments({ role: "donor" }),
     NGO.countDocuments(),Volunteer.countDocuments(),
     Donation.countDocuments(), Delivery.countDocuments(),
     Delivery.countDocuments({status: { $in: [
     "assigned", "accepted_by_volunteer","picked_up", "in_transit"
     ] }}) ]);
     return {totalUsers, totalDonors, totalNGOs,
     totalVolunteers, totalDonations, totalDeliveries,
      activeDeliveries };}

 /*Get All Users*/
async getUsers(search, role, page, limit) {
    const query = {};
    if (search) {query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                email: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }

    if (role) {

        query.role = role;

    }

    const users = await User.find(query)

        .select("-password")

        .skip((page - 1) * limit)

        .limit(limit)

        .sort({

            createdAt: -1

        });

    const total = await User.countDocuments(query);

    return {

        users,

        total

    };

}

/*
=========================================
Get User By Id
=========================================
*/

async getUserById(id) {

    return await User.findById(id)

        .select("-password");

}

/*
=========================================
Update User
=========================================
*/

async updateUser(id, data) {

    return await User.findByIdAndUpdate(

        id,

        data,

        {

            new: true

        }

    ).select("-password");

}

/*
=========================================
Delete User
=========================================
*/

async deleteUser(id) {

    return await User.findByIdAndDelete(id);

}

/*
=========================================
Get All NGOs
=========================================
*/

async getNGOs() {

    return await NGO.find()

        .populate("userId", "name email")

        .sort({

            createdAt: -1

        });

}

/*
=========================================
Get NGO By Id
=========================================
*/

async getNGOById(id) {

    return await NGO.findById(id)

        .populate("userId", "name email");

}

/*
=========================================
Approve NGO
=========================================
*/

async approveNGO(id) {

    return await NGO.findByIdAndUpdate(

        id,

        {

            isApproved: true, approvalStatus: "approved"

        },

        {

            new: true

        }

    )  .populate("userId", "name email");

}

/*
=========================================
Reject NGO
=========================================
*/

async rejectNGO(id) {

    return await NGO.findByIdAndUpdate(

        id,

        {

            isApproved: false,    approvalStatus: "rejected"

        },

        {

            new: true

        }

    )  .populate("userId", "name email");

}

/*
=========================================
Disable NGO
=========================================
*/

async disableNGO(id) {

    return await NGO.findByIdAndUpdate(

        id,

        {

            isActive: false

        },{ new: true});}

/*
=========================================
Get Delivery By Id
=========================================
*/
async getDeliveries() {

    return await Delivery.find()

        .populate({
            path: "donationId",
            select: "title"
        })

        .populate({
            path: "volunteerId",
            populate: {
                path: "userId",
                select: "name email"
            }
        })

        .populate({
            path: "ngoId",
            populate: {
                path: "userId",
                select: "name email"
            }
        })

        .sort({
            createdAt: -1
        });

}

        /*
=========================================
Get All Volunteers
=========================================
*/

async getVolunteers() {

    return await Volunteer.find()

        .populate(

            "userId",

            "name email"

        )

        .sort({

            createdAt: -1

        });

}

/*
=========================================
Get Volunteer By Id
=========================================
*/

async getVolunteerById(id) {

    return await Volunteer.findById(id)

        .populate(

            "userId",

            "name email"

        );

}
/*
=========================================
Get All Donations
=========================================
*/

async getDonations() {

    return await Donation.find()

        .populate("donorId", "name email")

        .sort({

            createdAt: -1

        });

}

/*
=========================================
Get Donation By Id
=========================================
*/

async getDonationById(id) {

    return await Donation.findById(id)

        .populate("donorId", "name email");

}

/*
=========================================
Delete Donation
=========================================
*/

async deleteDonation(id) {

    return await Donation.findByIdAndDelete(id);

}
/*
=========================================
Get Audit Logs
=========================================
*/

async getAuditLogs(filters) {

    const query = {};

    if (filters.userId) {

        query.userId = filters.userId;

    }

    if (filters.action) {

        query.action = filters.action;

    }

    if (filters.entityType) {

        query.entityType = filters.entityType;

    }

    if (filters.startDate && filters.endDate) {

        query.createdAt = {

            $gte: new Date(filters.startDate),

            $lte: new Date(filters.endDate)

        };

    }

    return await AuditLog.find(query)

        .populate("userId", "name email role")

        .sort({

            createdAt: -1

        });

}
/*
=========================================
Analytics
=========================================
*/

async getAnalytics() {

    const currentDate = new Date();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );

    /*
    -----------------------------------------
    Total Food Saved
    -----------------------------------------
    */

    const foodResult = await Donation.aggregate([

        {
            $group: {
                _id: null,
                totalFoodKg: {
                    $sum: "$quantity"
                }
            }
        }

    ]);

    const foodSavedKg =

        foodResult.length > 0

            ? foodResult[0].totalFoodKg

            : 0;

    /*
    -----------------------------------------
    Meals Served
    -----------------------------------------
    */

    const mealsServed = Math.round(

        foodSavedKg * 2.5

    );

    /*
    -----------------------------------------
    Active Volunteers
    -----------------------------------------
    */

    const activeVolunteers =

        await Volunteer.countDocuments({

            availability: true

        });

    /*
    -----------------------------------------
    Active NGOs
    -----------------------------------------
    */

    const activeNGOs =

        await NGO.countDocuments({

            isApproved: true,

            isActive: true

        });

    /*
    -----------------------------------------
    Deliveries This Month
    -----------------------------------------
    */

    const deliveriesThisMonth =

        await Delivery.countDocuments({

            createdAt: {

                $gte: firstDayOfMonth

            }

        });

    /*
    -----------------------------------------
    Donations This Month
    -----------------------------------------
    */

    const donationsThisMonth =

        await Donation.countDocuments({

            createdAt: {

                $gte: firstDayOfMonth

            }

        });

    return {

        foodSavedKg,

        mealsServed,

        activeVolunteers,

        activeNGOs,

        deliveriesThisMonth,

        donationsThisMonth

    };

}
/*
=========================================
Environmental Impact
=========================================
*/

async getEnvironmentalImpact() {

    const donations = await Donation.find();

    let totalFoodKg = 0;

    donations.forEach(donation => {

        totalFoodKg += donation.quantity || 0;

    });

    const mealsServed =
        totalFoodKg * 2.5;

    const co2Reduction =
        totalFoodKg * 2.1;

    const treesEquivalent =
        co2Reduction / 22;

    return {

        foodWastePreventedKg:
            totalFoodKg,

        mealsServed,

        co2ReductionKg:
            Number(co2Reduction.toFixed(2)),

        treesEquivalent:
            Number(treesEquivalent.toFixed(2))

    };

}
/*
====================================
Donation Report
====================================
*/
async donationReport() {

    return await Donation.find()

        .populate(
            "donorId",
            "name email phone"
        )

        .sort({
            createdAt: -1
        })

        .lean();

}

/*
====================================
Delivery Report
====================================
*/
async deliveryReport() {

    return await Delivery.find()

        .populate({
            path: "donationId",
            populate: {
                path: "donorId",
                model: "User",
                select: "name email"
            }
        })

        .populate({
            path: "volunteerId",
            populate: {
                path: "userId",
                model: "User",
                select: "name email"
            }
        })

        .populate({
            path: "ngoId",
            populate: {
                path: "userId",
                model: "User",
                select: "name email"
            }
        })
.sort({
            createdAt: -1
        })

        .lean();

}


/*
====================================
Volunteer Report
====================================
*/

async volunteerReport() {

    return await Volunteer.find().lean();

}

/*
====================================
NGO Report
====================================
*/

async ngoReport() {

    return await NGO.find().lean();

}
}

export default new AdminRepository();