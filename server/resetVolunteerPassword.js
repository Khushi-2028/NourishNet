import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({
      email: "anuj@gmail.com",
    });

    if (!user) {
      console.log("User not found");
      process.exit();
    }

    user.password = "Password@123";

    await user.save();

    console.log("=================================");
    console.log("Password Reset Successful");
    console.log("Email: anuj@gmail.com");
    console.log("Password: Password@123");
    console.log("=================================");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

resetPassword();