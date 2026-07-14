import mongoose from "mongoose";

const pickupRequestSchema = new mongoose.Schema(
{
    donationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
        required: true
    },

    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NGO",
        required: true
    },

    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
        default: null
    },

    requestedQuantity: {
        type: Number,
        required: true,
        min: 1
    },

    allocatedQuantity: {
        type: Number,
        default: 0
    },

    pickupDate: Date,

    pickupTime: String,

    deliveryAddress: String,

    contactPerson: String,

    contactPhone: String,

    landmark: String,

    floor: String,

    parkingInstructions: String,

    instructions: String,

    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "assigned",
            "picked",
            "delivered",
            "rejected",
            "cancelled"
        ],
        default: "pending"
    }
},
{
    timestamps: true
});

export default mongoose.model(
    "PickupRequest",
    pickupRequestSchema
);