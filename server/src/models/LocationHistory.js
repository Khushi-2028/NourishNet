import mongoose from "mongoose";

const locationHistorySchema =
new mongoose.Schema({

  deliveryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Delivery"
  },

  volunteerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Volunteer"
  },

  coordinates:{
    type:[Number],
    required:true
  },

  recordedAt:{
    type:Date,
    default:Date.now
  }

});

export default mongoose.model(
"LocationHistory",
locationHistorySchema
);