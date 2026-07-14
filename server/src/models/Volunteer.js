import mongoose from "mongoose";

const volunteerSchema =
new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  vehicleType:{
    type:String,
    enum:[
      "bike",
      "car",
      "van",
      "walking"
    ]
  },

  phone:{
    type:String
  },

  isAvailable:{
    type:Boolean,
    default:true
  },

  completedDeliveries:{
    type:Number,
    default:0
  },

  distanceCovered:{
    type:Number,
    default:0
  },

  rating:{
    type:Number,
    default:5
  },

  deviceToken: {
  type: String
}

},
{
timestamps:true
});

export default mongoose.model(
"Volunteer",
volunteerSchema
);