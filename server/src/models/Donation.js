import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    foodType: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    unit: {
      type: String,
      default: "kg"
    },

    preparationTime: {
      type: Date,
      required: true
    },

    expiryTime: {
      type: Date,
      required: true
    },

    remainingQuantity: {
    type: Number,
    default: function () {
        return this.quantity;
    }
},
    pickupAddress: {
      type: String,
      required: true
    },
  
    pickupLocation: {
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  }
    },
    reserved: {
       type: Boolean,
      default: false
    },
    reservedAt:{
     type:Date
    },
    acceptedByNgo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    

    images: [String],

    status: {
      type: String,
      enum: [

"available",

"reserved",

"accepted",

"volunteer_assigned",

"pickup_started",

"picked",

"in_transit","awaiting_confirmation",

"delivered",

"cancelled",

"expired",


],
      default: "available"
    },

    qualityStatus: {
      type: String,
      enum: [
        "safe",
        "moderate",
        "high_risk"
      ],
      default: "safe"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Donation",
  donationSchema
);
donationSchema.index({
    donorId: 1
});

donationSchema.index({
    status: 1
});

donationSchema.index({
    expiryTime: 1
});

donationSchema.index({
    createdAt: -1
});