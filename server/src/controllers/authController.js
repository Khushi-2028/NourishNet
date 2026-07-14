import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import sendEmail from "../utils/sendEmail.js";
import { sendNotification } from "../utils/notificationEmitter.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/token.js";

/*
=================================
REGISTER
=================================
*/
export const register = async (
  req,
  res
) => {

  const {
  name,  email,  password,  role,  phone, address,
   donorType,  organizationName,  licenseNumber,
  description,  vehicle, availability
} = req.body;

  const existingUser =
    await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const verificationToken =
    crypto.randomUUID();

 const autoVerify =
  process.env.NODE_ENV === "development";

const user=await User.create({
  name,
  email,
  password,
  role,

  phone: req.body.phone,
  address: req.body.address,

  donorType: req.body.donorType,
  organizationName: req.body.organizationName,
  licenseNumber: req.body.licenseNumber,
  description: req.body.description,

  vehicle: req.body.vehicle,
  availability: req.body.availability,

  verificationToken: autoVerify
    ? null
    : verificationToken,

  isVerified: autoVerify
});
const admins = await User.find({ role: "admin" });

await Promise.all(
    admins.map((admin) =>
        sendNotification({
            userId: admin._id,
            title: "New User Registered",
            message: `${name} registered as ${role}.`,
            type: "admin"
        })
    )
);

  const verifyLink =
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  console.log("\nVerification Link:");
  console.log(verifyLink);

  res.status(201).json({
    success: true,
    message:
      "Registration successful. Check email."
  });

};

/*
=================================
VERIFY EMAIL
=================================
*/
export const verifyEmail = async (
  req,
  res
) => {

  const { token } = req.params;

  const user =
    await User.findOne({
      verificationToken: token
    });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token"
    });
  }

  user.isVerified = true;
  user.verificationToken = null;

  await user.save();

  res.json({
    success: true,
    message: "Email verified"
  });

};

/*
=================================
LOGIN
=================================
*/
export const login = async (
  req,
  res
) => {

  const {
    email,
    password
  } = req.body;

  const user =
    await User.findOne({ email });
    console.log("User Found:");
    console.log(user);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const match =
    await user.comparePassword(
      password
    );
console.log("Password Entered:");
console.log(password);

console.log("Stored Hash:");
console.log(user.password);

console.log("Password Match:");
console.log(match);

  if (!match) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  if (!user.isVerified) {
    return res.status(401).json({
      message: "Verify email first"
    });
  }

  const accessToken =
    generateAccessToken(user._id);

  const refreshToken =
    generateRefreshToken(user._id);

  user.refreshToken =
    refreshToken;

  await user.save();

  res.json({

    success: true,

    accessToken,

    refreshToken,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }

  });

};

/*
=================================
REFRESH TOKEN
=================================
*/
export const refreshToken = async (
  req,
  res
) => {

  const { refreshToken } =
    req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user =
      await User.findById(
        decoded.id
      );

    if (
      !user ||
      user.refreshToken !== refreshToken
    ) {

      return res.status(401).json({
        message:
          "Invalid refresh token"
      });

    }

    const accessToken =
      generateAccessToken(
        user._id
      );

    res.json({
      success: true,
      accessToken
    });

  } catch (error) {

    return res.status(401).json({
      message: "Token invalid"
    });

  }

};

/*
=================================
FORGOT PASSWORD
=================================
*/
export const forgotPassword = async (
  req,
  res
) => {

  const { email } =
    req.body;

  const user =
    await User.findOne({ email });

  if (!user) {

    return res.status(404).json({
      message: "User not found"
    });

  }

  const token =
    crypto.randomUUID();

  user.resetPasswordToken =
    token;

  user.resetPasswordExpire =
    Date.now() + 3600000;

  await user.save();

  const resetLink =
    `${process.env.CLIENT_URL}/reset-password/${token}`;

  console.log("\nReset Link:");
  console.log(resetLink);

  res.json({

    success: true,

    message:
      "Password reset link generated"

  });

};

/*
=================================
RESET PASSWORD
=================================
*/
export const resetPassword = async (
  req,
  res
) => {

  const { token } =
    req.params;

  const { password } =
    req.body;

  const user =
    await User.findOne({

      resetPasswordToken: token,

      resetPasswordExpire: {
        $gt: Date.now()
      }

    });

  if (!user) {

    return res.status(400).json({
      message:
        "Invalid or expired token"
    });

  }

  user.password = password;

  user.resetPasswordToken = null;

  user.resetPasswordExpire = null;

  await user.save();

  res.json({

    success: true,

    message:
      "Password reset successful"

  });

};