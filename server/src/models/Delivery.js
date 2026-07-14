import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
{
  pickupRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PickupRequest",
    required: true
  },

  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
    required: true
  },

  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
    required: true
  },

  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true
  },

  status: {
    type: String,
    enum: [
      "assigned",
      "accepted_by_volunteer",
      "picked_up",
      "in_transit",
      "awaiting_confirmation",
      "delivered"
    ],
    default: "assigned"
  },

  pickupTime: Date,

  deliveryTime: Date,

  notes: String,

  /*
  ==========================
  GEO LOCATION FIELDS
  ==========================
  */

  pickupLocation: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },

  currentLocation: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },

  destinationLocation: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },
  locationHistory: [
{
    latitude:Number,
    longitude:Number,
    timestamp:{
        type:Date,
        default:Date.now
    }
}
],
proofImage: {
    type: String,
    default: null,
},

proofNotes: {
    type: String,
    default: "",
},

proofUploadedAt: {
    type: Date,
    default: null,
},

confirmedAt: {
    type: Date,
    default: null,
},

confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
},
},
{
  timestamps: true
}
);


// Geo Index
deliverySchema.index({
  currentLocation: "2dsphere"
});

export default mongoose.model(
  "Delivery",
  deliverySchema
);