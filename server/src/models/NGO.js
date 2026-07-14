import mongoose from "mongoose";
const ngoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",required: true,unique: true },
  ngoName: {
    type: String, required: true },
  registrationNumber: {
    type: String, required: true },

  address: {
    type: String,
    required: true
  },
  
  location: {
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  }
},

  capacity: {
    type: Number,
    default: 0
  },

  servedAreas: [String],

  mealsDistributed: {
    type: Number,
    default: 0
  },
  approvalStatus: {
    type: String,
    enum: [
        "pending",
        "approved",
        "rejected"
    ],
    default: "pending"
},
  isApproved: {
  type: Boolean,
  default: false
},

isActive: {
  type: Boolean,
  default: true
}
}, {
  timestamps: true
});

export default mongoose.model(
  "NGO",
  ngoSchema
);