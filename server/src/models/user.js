import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: [
        "donor",
        "ngo",
        "volunteer",
        "admin"
      ],
      default: "donor"
    },

    phone: {
  type: String,
  trim: true
},

address: {
  type: String,
  trim: true
},

profileImage: {
  type: String,
  default: ""
},

donorType: {
  type: String,
  enum: ["restaurant", "individual", "event", ""],
  default: ""
},

organizationName: {
  type: String,
  default: ""
},

licenseNumber: {
  type: String,
  default: ""
},

description: {
  type: String,
  default: ""
},

vehicle: {
  type: String,
  default: ""
},

availability: {
  type: String,
  enum: ["available", "busy", "offline", ""],
  default: ""
},

currentLocation: {
  latitude: Number,
  longitude: Number
},

    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
     type: Boolean,
     default: true
    },

    refreshToken: String,

    verificationToken: String,

    resetPasswordToken: String,

    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

userSchema.methods.comparePassword =
async function (password) {
  return bcrypt.compare(
    password,
    this.password
  );
};

export default mongoose.model(
  "User",
  userSchema
);