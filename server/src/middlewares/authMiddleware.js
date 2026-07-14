import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (
  req,
  res,
  next
) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {

    token =
      req.headers.authorization.split(
        " "
      )[1];

  }

  if (!token) {

    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });

  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found"
      });

    }

    req.user = {

      id: user._id.toString(),

      name: user.name,

      email: user.email,

      role: user.role

    };

    next();

  } catch (error) {

    return res.status(401).json({

      success: false,

      message: "Token Invalid"

    });

  }

};

export default protect;