import express from "express";

const router = express.Router();

import {
  register,
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword
}
from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation
}
from "../validators/authValidator.js";

import validateRequest
from "../middlewares/validateRequest.js";

router.post(
  "/register",
  registerValidation,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidation,
  validateRequest,
  login
);

router.post(
  "/refresh-token",
  refreshToken
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

router.get(
  "/verify-email/:token",
  verifyEmail
);

export default router;